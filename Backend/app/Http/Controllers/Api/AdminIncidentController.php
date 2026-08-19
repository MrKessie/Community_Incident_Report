<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignIncidentRequest;
use App\Http\Requests\UpdateIncidentStatusRequest;
use App\Http\Requests\RejectIncidentRequest;
use App\Http\Resources\IncidentResource;
use App\Http\Resources\IncidentListResource;
use App\Models\Incident;
use App\Models\IncidentUpdate;
use App\Services\IncidentService;
use App\Services\NotificationService;
use App\Notifications\IncidentVerifiedNotification;
use App\Notifications\IncidentRejectedNotification;
use App\Notifications\IncidentAssignedNotification;
use App\Notifications\IncidentClosedNotification;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminIncidentController extends Controller
{
    public function __construct(
        protected IncidentService $incidentService,
        protected NotificationService $notificationService
    ) {}

    public function index(Request $request)
    {
        $query = Incident::with(['category', 'reporter', 'activeAssignment.team']);

        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('severity')) $query->where('severity', $request->severity);
        if ($request->filled('category_id')) $query->where('category_id', $request->category_id);
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $incidents = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 25));
        return IncidentResource::collection($incidents);
    }

    public function show($id)
    {
        $incident = Incident::with(['category', 'reporter', 'activeAssignment.team', 'media', 'updates.updater', 'statusHistories.changedBy', 'feedback', 'duplicateOf'])->findOrFail($id);
        return new IncidentResource($incident);
    }

    public function verify(Request $request, $id)
    {
        $incident = $this->incidentService->verifyIncident($id, 'verify', $request->reason, $request->severity, $request->user());
        $this->notificationService->notifyReporter($incident, new IncidentVerifiedNotification($incident));

        return response()->json([
            'message' => 'Incident verified successfully',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function reject(RejectIncidentRequest $request, $id)
    {
        $validated = $request->validated();
        $incident = $this->incidentService->verifyIncident($id, 'reject', $validated['reason'], null, $request->user());
        $this->notificationService->notifyReporter($incident, new IncidentRejectedNotification($incident, $validated['reason']));

        return response()->json([
            'message' => 'Incident rejected',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function assign(AssignIncidentRequest $request, $id)
    {
        $validated = $request->validated();
        $incident = $this->incidentService->assignIncident($id, $validated['team_id'], $request->user(), $validated['notes'] ?? null);

        if ($incident->activeAssignment && $incident->activeAssignment->team) {
            $this->notificationService->notifyTeam($incident->activeAssignment->team, new IncidentAssignedNotification($incident, $incident->activeAssignment->team));
        }

        return response()->json([
            'message' => 'Incident assigned to team',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function reassign(AssignIncidentRequest $request, $id)
    {
        return $this->assign($request, $id);
    }

    public function updateStatus(UpdateIncidentStatusRequest $request, $id)
    {
        $validated = $request->validated();
        $incident = $this->incidentService->updateStatus($id, $validated['status'], $request->user(), $validated['reason'] ?? null);

        return response()->json([
            'message' => 'Incident status updated',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function updatePriority(Request $request, $id)
    {
        $request->validate(['severity' => 'required|in:low,medium,high,critical']);
        $incident = Incident::findOrFail($id);
        $incident->severity = $request->severity;
        $incident->save();

        return response()->json([
            'message' => 'Priority updated',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function addNote(Request $request, $id)
    {
        $request->validate(['note' => 'required|string']);
        $incident = Incident::findOrFail($id);
        $incident->admin_notes = ($incident->admin_notes ? $incident->admin_notes . "\n" : '') . "[" . now()->format('Y-m-d H:i') . "] " . $request->note;
        $incident->save();

        return response()->json([
            'message' => 'Internal note added',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function addPublicUpdate(Request $request, $id)
    {
        $request->validate(['message' => 'required|string']);
        $incident = Incident::findOrFail($id);

        $update = IncidentUpdate::create([
            'incident_id' => $incident->id,
            'updated_by' => $request->user()->id,
            'update_type' => 'note_added',
            'message' => $request->message,
            'is_public' => true,
        ]);

        return response()->json([
            'message' => 'Public update posted',
            'update' => $update,
        ]);
    }

    public function markDuplicate(Request $request, $id)
    {
        $request->validate(['duplicate_of_id' => 'required|exists:incidents,id']);
        $incident = $this->incidentService->markDuplicate($id, $request->duplicate_of_id, $request->user());

        return response()->json([
            'message' => 'Incident marked as duplicate',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function close(Request $request, $id)
    {
        $incident = $this->incidentService->updateStatus($id, 'closed', $request->user(), $request->reason ?? 'Closed by administrator.');
        $this->notificationService->notifyReporter($incident, new IncidentClosedNotification($incident));

        return response()->json([
            'message' => 'Incident ticket closed',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function exportCSV(): StreamedResponse
    {
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=incidents-export-" . date('Y-m-d') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Reference #', 'Title', 'Category', 'Severity', 'Status', 'Address', 'Reported At']);

            Incident::with('category')->chunk(100, function($incidents) use ($file) {
                foreach ($incidents as $inc) {
                    fputcsv($file, [
                        $inc->id,
                        $inc->reference_number,
                        $inc->title,
                        $inc->category?->name,
                        $inc->severity,
                        $inc->status,
                        $inc->address,
                        $inc->reported_at,
                    ]);
                }
            });
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

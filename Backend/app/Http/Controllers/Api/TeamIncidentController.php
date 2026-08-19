<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddIncidentUpdateRequest;
use App\Http\Resources\IncidentResource;
use App\Models\Incident;
use App\Models\IncidentUpdate;
use App\Services\IncidentService;
use App\Services\MediaService;
use App\Services\NotificationService;
use App\Notifications\IncidentResolvedNotification;
use Illuminate\Http\Request;

class TeamIncidentController extends Controller
{
    public function __construct(
        protected IncidentService $incidentService,
        protected MediaService $mediaService,
        protected NotificationService $notificationService
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $teamIds = $user->teams->pluck('id')->toArray();

        $incidents = Incident::with(['category', 'reporter', 'activeAssignment.team', 'media'])
            ->whereHas('activeAssignment', function($q) use ($teamIds) {
                $q->whereIn('team_id', $teamIds)->where('is_active', true);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return IncidentResource::collection($incidents);
    }

    public function show(Request $request, $id)
    {
        $incident = Incident::with(['category', 'reporter', 'activeAssignment.team', 'media', 'updates.updater', 'statusHistories.changedBy', 'feedback'])->findOrFail($id);
        return new IncidentResource($incident);
    }

    public function acknowledge(Request $request, $id)
    {
        $incident = $this->incidentService->updateStatus($id, 'in_progress', $request->user(), 'Response team acknowledged assignment and dispatched to scene.');
        return response()->json([
            'message' => 'Incident assignment acknowledged',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function updateProgress(AddIncidentUpdateRequest $request, $id)
    {
        $validated = $request->validated();
        $incident = Incident::findOrFail($id);

        $newStatus = $validated['new_status'] ?? $incident->status;
        if ($newStatus !== $incident->status) {
            $incident = $this->incidentService->updateStatus($id, $newStatus, $request->user(), $validated['message']);
        } else {
            IncidentUpdate::create([
                'incident_id' => $incident->id,
                'updated_by' => $request->user()->id,
                'update_type' => 'note_added',
                'previous_status' => $incident->status,
                'new_status' => $incident->status,
                'message' => $validated['message'],
                'is_public' => $validated['is_public'] ?? true,
            ]);
        }

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                if ($this->mediaService->validateMediaFile($file)) {
                    $this->mediaService->uploadMedia($incident, $file, $request->user());
                }
            }
        }

        return response()->json([
            'message' => 'Response progress logged',
            'incident' => new IncidentResource($incident->load(['updates', 'media'])),
        ]);
    }

    public function resolve(Request $request, $id)
    {
        $request->validate(['notes' => 'nullable|string']);
        $incident = $this->incidentService->updateStatus($id, 'resolved', $request->user(), $request->notes ?? 'Incident hazard mitigated and resolved by response unit.');

        $this->notificationService->notifyReporter($incident, new IncidentResolvedNotification($incident));

        return response()->json([
            'message' => 'Incident resolved successfully',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function uploadResponseMedia(Request $request, $id)
    {
        $request->validate(['files.*' => 'required|file|max:51200']);
        $incident = Incident::findOrFail($id);

        $uploaded = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                if ($this->mediaService->validateMediaFile($file)) {
                    $uploaded[] = $this->mediaService->uploadMedia($incident, $file, $request->user());
                }
            }
        }

        return response()->json([
            'message' => 'Response media uploaded',
            'media' => $uploaded,
        ]);
    }
}

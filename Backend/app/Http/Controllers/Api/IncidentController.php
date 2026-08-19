<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateIncidentRequest;
use App\Http\Requests\UpdateIncidentRequest;
use App\Http\Requests\SubmitFeedbackRequest;
use App\Http\Resources\IncidentResource;
use App\Http\Resources\IncidentListResource;
use App\Http\Resources\IncidentStatusHistoryResource;
use App\Models\Incident;
use App\Models\Feedback;
use App\Services\IncidentService;
use App\Services\MediaService;
use App\Services\NotificationService;
use App\Notifications\IncidentSubmittedNotification;
use Illuminate\Http\Request;

class IncidentController extends Controller
{
    public function __construct(
        protected IncidentService $incidentService,
        protected MediaService $mediaService,
        protected NotificationService $notificationService
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $incidents = Incident::with(['category', 'activeAssignment.team'])
            ->where('reporter_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return IncidentListResource::collection($incidents);
    }

    public function store(CreateIncidentRequest $request)
    {
        $validated = $request->validated();
        $user = $request->user();

        $incident = $this->incidentService->createIncident($validated, $user);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                if ($this->mediaService->validateMediaFile($file)) {
                    $this->mediaService->uploadMedia($incident, $file, $user);
                }
            }
        }

        $this->notificationService->notifyAdmin(new IncidentSubmittedNotification($incident));

        return response()->json([
            'message' => 'Incident reported successfully',
            'incident' => new IncidentResource($incident->load(['category', 'media'])),
        ], 201);
    }

    public function anonymousReport(CreateIncidentRequest $request)
    {
        $validated = $request->validated();
        $validated['is_anonymous'] = true;

        $incident = $this->incidentService->createIncident($validated, null);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                if ($this->mediaService->validateMediaFile($file)) {
                    $this->mediaService->uploadMedia($incident, $file, null);
                }
            }
        }

        $this->notificationService->notifyAdmin(new IncidentSubmittedNotification($incident));

        return response()->json([
            'message' => 'Anonymous incident report submitted',
            'incident' => new IncidentResource($incident->load(['category', 'media'])),
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $incident = Incident::with(['category', 'reporter', 'activeAssignment.team', 'media', 'updates.updater', 'statusHistories.changedBy', 'feedback'])->findOrFail($id);

        return new IncidentResource($incident);
    }

    public function update(UpdateIncidentRequest $request, $id)
    {
        $incident = Incident::where('id', $id)->where('reporter_id', $request->user()->id)->firstOrFail();

        if ($incident->status !== 'submitted') {
            return response()->json(['message' => 'Cannot modify incident after review has started.'], 403);
        }

        $incident->update($request->validated());
        return response()->json([
            'message' => 'Incident updated successfully',
            'incident' => new IncidentResource($incident),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $incident = Incident::where('id', $id)->where('reporter_id', $request->user()->id)->firstOrFail();

        if ($incident->status !== 'submitted') {
            return response()->json(['message' => 'Cannot delete incident after review has started.'], 403);
        }

        $incident->delete();
        return response()->json(['message' => 'Incident deleted successfully']);
    }

    public function timeline($id)
    {
        $incident = Incident::with('statusHistories.changedBy')->findOrFail($id);
        return IncidentStatusHistoryResource::collection($incident->statusHistories);
    }

    public function submitFeedback(SubmitFeedbackRequest $request, $id)
    {
        $incident = Incident::findOrFail($id);
        $validated = $request->validated();

        $feedback = Feedback::updateOrCreate(
            ['incident_id' => $incident->id, 'reporter_id' => $request->user()->id],
            [
                'was_resolved' => $validated['was_resolved'],
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
                'submitted_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Feedback submitted successfully',
            'feedback' => $feedback,
        ]);
    }
}

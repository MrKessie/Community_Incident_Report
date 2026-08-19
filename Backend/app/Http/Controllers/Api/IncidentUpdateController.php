<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\IncidentUpdate;
use App\Models\IncidentStatusHistory;
use App\Models\IncidentMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class IncidentUpdateController extends Controller
{
    public function store(Request $request, $incidentId)
    {
        $incident = Incident::findOrFail($incidentId);

        $validated = $request->validate([
            'message' => 'required|string',
            'new_status' => 'nullable|in:in_progress,resolved,closed',
            'is_public' => 'boolean',
            'files.*' => 'nullable|file|max:10240',
        ]);

        $oldStatus = $incident->status;
        $newStatus = $validated['new_status'] ?? $oldStatus;
        $isStatusChange = ($newStatus !== $oldStatus);

        if ($isStatusChange) {
            $incident->status = $newStatus;
            if ($newStatus === 'resolved') $incident->resolved_at = now();
            if ($newStatus === 'closed') $incident->closed_at = now();
            $incident->save();

            IncidentStatusHistory::create([
                'incident_id' => $incident->id,
                'changed_by' => $request->user()->id,
                'previous_status' => $oldStatus,
                'new_status' => $newStatus,
                'reason' => 'Response team updated status to ' . $newStatus,
            ]);
        }

        $update = IncidentUpdate::create([
            'incident_id' => $incident->id,
            'updated_by' => $request->user()->id,
            'update_type' => $isStatusChange ? 'status_change' : 'note_added',
            'previous_status' => $oldStatus,
            'new_status' => $newStatus,
            'message' => $validated['message'],
            'is_public' => $validated['is_public'] ?? true,
        ]);

        // Upload media attached to field update
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('incidents/updates', 'public');
                $mime = $file->getClientMimeType();
                $type = 'document';
                if (Str::startsWith($mime, 'image/')) $type = 'image';

                IncidentMedia::create([
                    'incident_id' => $incident->id,
                    'file_path' => '/storage/' . $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_type' => $type,
                    'file_size' => $file->getSize(),
                    'mime_type' => $mime,
                    'uploaded_by' => $request->user()->id,
                ]);
            }
        }

        return response()->json([
            'message' => 'Update added successfully',
            'update' => $update->load('updater'),
            'incident' => $incident->load(['updates.updater', 'media', 'statusHistories']),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\Team;
use App\Models\IncidentAssignment;
use App\Models\IncidentStatusHistory;
use App\Models\IncidentUpdate;
use Illuminate\Http\Request;

class IncidentAssignmentController extends Controller
{
    public function assign(Request $request, $incidentId)
    {
        $incident = Incident::findOrFail($incidentId);

        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'notes' => 'nullable|string',
        ]);

        // Deactivate previous assignments
        IncidentAssignment::where('incident_id', $incident->id)->update(['is_active' => false]);

        $assignment = IncidentAssignment::create([
            'incident_id' => $incident->id,
            'team_id' => $validated['team_id'],
            'assigned_by' => $request->user()->id,
            'assigned_at' => now(),
            'notes' => $validated['notes'] ?? null,
            'is_active' => true,
        ]);

        $team = Team::find($validated['team_id']);
        $oldStatus = $incident->status;

        $incident->status = 'assigned';
        $incident->assigned_at = now();
        $incident->save();

        IncidentStatusHistory::create([
            'incident_id' => $incident->id,
            'changed_by' => $request->user()->id,
            'previous_status' => $oldStatus,
            'new_status' => 'assigned',
            'reason' => 'Assigned to response team: ' . $team->name,
        ]);

        IncidentUpdate::create([
            'incident_id' => $incident->id,
            'updated_by' => $request->user()->id,
            'update_type' => 'assignment',
            'previous_status' => $oldStatus,
            'new_status' => 'assigned',
            'message' => 'Incident assigned to ' . $team->name . '. Dispatch initiated.',
            'is_public' => true,
        ]);

        return response()->json([
            'message' => 'Incident assigned to ' . $team->name,
            'assignment' => $assignment->load(['team', 'assigner']),
            'incident' => $incident->load(['activeAssignment.team']),
        ]);
    }
}

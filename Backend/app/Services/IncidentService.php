<?php

namespace App\Services;

use App\Models\Incident;
use App\Models\IncidentAssignment;
use App\Models\IncidentStatusHistory;
use App\Models\IncidentUpdate;
use App\Models\Team;
use Illuminate\Support\Facades\DB;

class IncidentService
{
    public function generateReferenceNumber(): string
    {
        $year = date('Y');
        $count = Incident::whereYear('created_at', $year)->count() + 1;
        return sprintf('INC-%s-%05d', $year, $count);
    }

    public function createIncident(array $data, $user = null): Incident
    {
        return DB::transaction(function () use ($data, $user) {
            $refNumber = $this->generateReferenceNumber();
            $rawAnon = $data['is_anonymous'] ?? false;
            $isAnonymous = filter_var($rawAnon, FILTER_VALIDATE_BOOLEAN);

            $incident = Incident::create([
                'reference_number' => $refNumber,
                'title' => $data['title'],
                'description' => $data['description'],
                'category_id' => $data['category_id'],
                'reporter_id' => ($user && !$isAnonymous) ? $user->id : null,
                'is_anonymous' => $isAnonymous,
                'severity' => $data['severity'] ?? 'medium',
                'status' => 'submitted',
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'address' => $data['address'] ?? null,
                'incident_date' => $data['incident_date'] ?? now(),
                'reported_at' => now(),
            ]);

            IncidentStatusHistory::create([
                'incident_id' => $incident->id,
                'changed_by' => $user ? $user->id : 1,
                'previous_status' => 'none',
                'new_status' => 'submitted',
                'reason' => 'Incident report submitted.',
            ]);

            return $incident;
        });
    }

    public function verifyIncident($incident, string $action, ?string $reason = null, ?string $severity = null, $user = null): Incident
    {
        $incidentModel = $incident instanceof Incident ? $incident : Incident::findOrFail($incident);
        $oldStatus = $incidentModel->status;

        if ($action === 'verify') {
            $incidentModel->status = 'verified';
            if ($severity) $incidentModel->severity = $severity;
        } else {
            $incidentModel->status = 'rejected';
            $incidentModel->rejection_reason = $reason ?? 'Report could not be verified.';
        }

        if ($reason) $incidentModel->admin_notes = $reason;
        $incidentModel->save();

        IncidentStatusHistory::create([
            'incident_id' => $incidentModel->id,
            'changed_by' => $user ? $user->id : 1,
            'previous_status' => $oldStatus,
            'new_status' => $incidentModel->status,
            'reason' => $reason ?? ($action === 'verify' ? 'Verified by admin.' : 'Rejected by admin.'),
        ]);

        return $incidentModel;
    }

    public function assignIncident($incident, int $teamId, $assignedBy = null, ?string $notes = null): Incident
    {
        $incidentModel = $incident instanceof Incident ? $incident : Incident::findOrFail($incident);
        $team = Team::findOrFail($teamId);

        IncidentAssignment::where('incident_id', $incidentModel->id)->update(['is_active' => false]);

        IncidentAssignment::create([
            'incident_id' => $incidentModel->id,
            'team_id' => $team->id,
            'assigned_by' => $assignedBy ? $assignedBy->id : 1,
            'assigned_at' => now(),
            'notes' => $notes,
            'is_active' => true,
        ]);

        $oldStatus = $incidentModel->status;
        $incidentModel->status = 'assigned';
        $incidentModel->assigned_at = now();
        $incidentModel->save();

        IncidentStatusHistory::create([
            'incident_id' => $incidentModel->id,
            'changed_by' => $assignedBy ? $assignedBy->id : 1,
            'previous_status' => $oldStatus,
            'new_status' => 'assigned',
            'reason' => 'Assigned to ' . $team->name,
        ]);

        IncidentUpdate::create([
            'incident_id' => $incidentModel->id,
            'updated_by' => $assignedBy ? $assignedBy->id : 1,
            'update_type' => 'assignment',
            'previous_status' => $oldStatus,
            'new_status' => 'assigned',
            'message' => 'Incident assigned to team: ' . $team->name,
            'is_public' => true,
        ]);

        return $incidentModel;
    }

    public function updateStatus($incident, string $newStatus, $user = null, ?string $message = null): Incident
    {
        $incidentModel = $incident instanceof Incident ? $incident : Incident::findOrFail($incident);
        $oldStatus = $incidentModel->status;

        $incidentModel->status = $newStatus;
        if ($newStatus === 'resolved') $incidentModel->resolved_at = now();
        if ($newStatus === 'closed') $incidentModel->closed_at = now();
        $incidentModel->save();

        IncidentStatusHistory::create([
            'incident_id' => $incidentModel->id,
            'changed_by' => $user ? $user->id : 1,
            'previous_status' => $oldStatus,
            'new_status' => $newStatus,
            'reason' => $message ?? 'Status changed to ' . $newStatus,
        ]);

        IncidentUpdate::create([
            'incident_id' => $incidentModel->id,
            'updated_by' => $user ? $user->id : 1,
            'update_type' => 'status_change',
            'previous_status' => $oldStatus,
            'new_status' => $newStatus,
            'message' => $message ?? 'Status updated to ' . strtoupper(str_replace('_', ' ', $newStatus)),
            'is_public' => true,
        ]);

        return $incidentModel;
    }

    public function markDuplicate($incident, int $duplicateOfId, $user = null): Incident
    {
        $incidentModel = $incident instanceof Incident ? $incident : Incident::findOrFail($incident);
        $masterInc = Incident::findOrFail($duplicateOfId);

        $incidentModel->is_duplicate = true;
        $incidentModel->duplicate_of = $masterInc->id;
        $incidentModel->status = 'closed';
        $incidentModel->admin_notes = 'Marked as duplicate of ' . $masterInc->reference_number;
        $incidentModel->save();

        return $incidentModel;
    }
}

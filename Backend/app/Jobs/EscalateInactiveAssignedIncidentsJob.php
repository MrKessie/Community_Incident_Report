<?php

namespace App\Jobs;

use App\Models\Incident;
use App\Models\User;
use App\Notifications\IncidentEscalationNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

class EscalateInactiveAssignedIncidentsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $admins = User::role(['admin', 'super_admin'])->get();
        $assignedIncidents = Incident::where('status', 'assigned')->get();

        foreach ($assignedIncidents as $inc) {
            $maxHours = ($inc->severity === 'critical') ? 2 : 4;
            $lastUpdate = $inc->updates()->latest()->first();
            $referenceTime = $lastUpdate ? $lastUpdate->created_at : ($inc->assigned_at ?? $inc->created_at);

            if ($referenceTime->diffInHours(now()) >= $maxHours) {
                $reason = "Assigned incident inactive with no updates for >{$maxHours} hours.";
                if ($admins->isNotEmpty()) {
                    Notification::send($admins, new IncidentEscalationNotification($inc, $reason));
                }
                if ($inc->activeAssignment && $inc->activeAssignment->team) {
                    Notification::send($inc.activeAssignment.team.users, new IncidentEscalationNotification($inc, $reason));
                }
            }
        }
    }
}

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

class EscalateUnassignedIncidentsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $admins = User::role(['admin', 'super_admin'])->get();
        if ($admins->isEmpty()) return;

        // 1. Submitted incidents not reviewed in 1 hour (30 min if critical)
        $submittedIncidents = Incident::where('status', 'submitted')->get();
        foreach ($submittedIncidents as $inc) {
            $maxMinutes = ($inc->severity === 'critical') ? 30 : 60;
            if ($inc->created_at->diffInMinutes(now()) >= $maxMinutes) {
                Notification::send($admins, new IncidentEscalationNotification($inc, "Submitted report unreviewed for >{$maxMinutes} minutes."));
            }
        }

        // 2. Verified incidents not assigned in 2 hours (1 hour if critical)
        $verifiedIncidents = Incident::where('status', 'verified')->get();
        foreach ($verifiedIncidents as $inc) {
            $maxMinutes = ($inc->severity === 'critical') ? 60 : 120;
            if ($inc->updated_at->diffInMinutes(now()) >= $maxMinutes) {
                Notification::send($admins, new IncidentEscalationNotification($inc, "Verified incident unassigned for >{$maxMinutes} minutes."));
            }
        }
    }
}

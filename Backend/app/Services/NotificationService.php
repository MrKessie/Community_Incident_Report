<?php

namespace App\Services;

use App\Models\User;
use App\Models\Team;
use App\Models\Incident;
use Illuminate\Support\Facades\Notification;

class NotificationService
{
    public function notifyAdmin($notificationInstance): void
    {
        $admins = User::role(['admin', 'super_admin'])->get();
        if ($admins->count() > 0) {
            Notification::send($admins, $notificationInstance);
        }
    }

    public function notifyReporter(Incident $incident, $notificationInstance): void
    {
        if ($incident->reporter && !$incident->is_anonymous) {
            $incident->reporter->notify($notificationInstance);
        }
    }

    public function notifyTeam(Team $team, $notificationInstance): void
    {
        $teamMembers = $team->users;
        if ($teamMembers->count() > 0) {
            Notification::send($teamMembers, $notificationInstance);
        }
    }
}

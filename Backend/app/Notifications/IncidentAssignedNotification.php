<?php

namespace App\Notifications;

use App\Models\Incident;
use App\Models\Team;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IncidentAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Incident $incident, public Team $team) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Dispatch Alert: Incident {$this->incident->reference_number} Assigned")
            ->line("Incident {$this->incident->reference_number} has been assigned to response unit {$this->team->name}.")
            ->action('View Dispatch Board', url("/response"));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incident->id,
            'team_id' => $this->team->id,
            'reference_number' => $this->incident->reference_number,
            'message' => "Incident {$this->incident->reference_number} assigned to {$this->team->name}.",
        ];
    }
}

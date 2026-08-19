<?php

namespace App\Notifications;

use App\Models\Incident;
use App\Models\IncidentUpdate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IncidentPublicUpdateNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Incident $incident, public IncidentUpdate $update) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Field Update Logged: {$this->incident->reference_number}")
            ->line("A new update has been logged for incident {$this->incident->reference_number}:")
            ->line("\"{$this->update->message}\"")
            ->action('View Full Timeline', url("/incidents/{$this->incident->id}"));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incident->id,
            'reference_number' => $this->incident->reference_number,
            'message' => "New update logged for incident {$this->incident->reference_number}.",
        ];
    }
}

<?php

namespace App\Notifications;

use App\Models\Incident;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IncidentEscalationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Incident $incident, public string $escalationReason) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("ESCALATION NOTICE: {$this->incident->reference_number}")
            ->line("Incident {$this->incident->reference_number} requires immediate administrative attention.")
            ->line("Reason: {$this.escalationReason}")
            ->action('Take Action Now', url("/admin/incidents"));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incident->id,
            'reference_number' => $this->incident->reference_number,
            'reason' => $this.escalationReason,
            'message' => "ESCALATION: Incident {$this->incident->reference_number} - {$this.escalationReason}",
        ];
    }
}

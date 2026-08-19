<?php

namespace App\Notifications;

use App\Models\Incident;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IncidentRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Incident $incident, public string $reason) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Incident Status Update: {$this->incident->reference_number}")
            ->line("Your reported incident {$this->incident->reference_number} was reviewed and rejected.")
            ->line("Reason: {$this.reason}");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incident->id,
            'reference_number' => $this->incident->reference_number,
            'reason' => $this->reason,
            'message' => "Incident report {$this->incident->reference_number} rejected. Reason: {$this.reason}",
        ];
    }
}

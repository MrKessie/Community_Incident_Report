<?php

namespace App\Notifications;

use App\Models\Incident;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IncidentResolvedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Incident $incident) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Incident Resolved: {$this->incident->reference_number}")
            ->line("Your reported incident {$this->incident->reference_number} has been resolved by the response unit.")
            ->line("Please take a moment to provide feedback on our emergency response service.")
            ->action('Provide Feedback', url("/incidents/{$this->incident->id}"));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incident->id,
            'reference_number' => $this->incident->reference_number,
            'message' => "Incident {$this->incident->reference_number} has been marked as resolved.",
        ];
    }
}

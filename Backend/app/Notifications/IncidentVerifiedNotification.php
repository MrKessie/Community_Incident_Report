<?php

namespace App\Notifications;

use App\Models\Incident;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IncidentVerifiedNotification extends Notification implements ShouldQueue
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
            ->subject("Incident Verified: {$this->incident->reference_number}")
            ->line("Your reported incident {$this->incident->reference_number} has been verified by emergency dispatchers.")
            ->action('Track Incident Progress', url("/incidents/{$this->incident->id}"));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incident->id,
            'reference_number' => $this->incident->reference_number,
            'message' => "Your incident report {$this->incident->reference_number} has been verified.",
        ];
    }
}

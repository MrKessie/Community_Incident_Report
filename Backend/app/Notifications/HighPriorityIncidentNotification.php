<?php

namespace App\Notifications;

use App\Models\Incident;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HighPriorityIncidentNotification extends Notification implements ShouldQueue
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
            ->subject("CRITICAL ALERT: {$this->incident->reference_number}")
            ->line("A CRITICAL severity incident has been reported: {$this->incident->title}")
            ->action('Immediate Dispatch Action', url("/admin/incidents"));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incident->id,
            'reference_number' => $this->incident->reference_number,
            'message' => "CRITICAL severity alert logged: {$this->incident->reference_number}.",
        ];
    }
}

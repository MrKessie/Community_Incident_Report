<?php

namespace App\Notifications;

use App\Models\Incident;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewAssignmentNotification extends Notification implements ShouldQueue
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
            ->subject("New Dispatch Duty: {$this->incident->reference_number}")
            ->line("You have been assigned to emergency dispatch task {$this->incident->reference_number}.")
            ->action('Access Dispatch Board', url("/response"));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incident->id,
            'reference_number' => $this->incident->reference_number,
            'message' => "New dispatch duty assigned: {$this->incident->reference_number}.",
        ];
    }
}

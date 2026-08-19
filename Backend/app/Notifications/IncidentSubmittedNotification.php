<?php

namespace App\Notifications;

use App\Models\Incident;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IncidentSubmittedNotification extends Notification implements ShouldQueue
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
            ->subject("New Incident Submitted: {$this->incident->reference_number}")
            ->greeting("Hello {$notifiable->name},")
            ->line("A new incident report has been submitted to the Community Incident System.")
            ->line("Reference: {$this->incident->reference_number}")
            ->line("Title: {$this->incident->title}")
            ->line("Severity: " . strtoupper($this->incident->severity))
            ->action('Review Incident', url("/admin/incidents"))
            ->line('Thank you for helping keep our community safe.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incident->id,
            'reference_number' => $this->incident->reference_number,
            'title' => $this->incident->title,
            'severity' => $this->incident->severity,
            'message' => "New incident report {$this->incident->reference_number} submitted.",
        ];
    }
}

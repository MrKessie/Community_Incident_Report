<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncidentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference_number' => $this->reference_number,
            'title' => $this->title,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'reporter_id' => $this->is_anonymous ? null : $this->reporter_id,
            'reporter' => $this->is_anonymous ? null : new UserResource($this->whenLoaded('reporter')),
            'is_anonymous' => $this->is_anonymous,
            'severity' => $this->severity,
            'status' => $this->status,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'address' => $this->address,
            'incident_date' => $this->incident_date?->toIso8601String(),
            'reported_at' => $this->reported_at?->toIso8601String(),
            'assigned_at' => $this->assigned_at?->toIso8601String(),
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            'closed_at' => $this->closed_at?->toIso8601String(),
            'rejection_reason' => $this->rejection_reason,
            'admin_notes' => $this->admin_notes,
            'is_duplicate' => $this->is_duplicate,
            'duplicate_of' => $this->duplicate_of,
            'active_assignment' => new IncidentAssignmentResource($this->whenLoaded('activeAssignment')),
            'media' => IncidentMediaResource::collection($this->whenLoaded('media')),
            'updates' => IncidentUpdateResource::collection($this->whenLoaded('updates')),
            'status_history' => IncidentStatusHistoryResource::collection($this->whenLoaded('statusHistories')),
            'feedback' => new FeedbackResource($this->whenLoaded('feedback')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

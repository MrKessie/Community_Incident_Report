<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'incident_id' => $this->incident_id,
            'reporter_id' => $this->reporter_id,
            'reporter' => new UserResource($this->whenLoaded('reporter')),
            'was_resolved' => $this->was_resolved,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
        ];
    }
}

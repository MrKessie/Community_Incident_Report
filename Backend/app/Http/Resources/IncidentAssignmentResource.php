<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncidentAssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'team_id' => $this->team_id,
            'team' => new TeamResource($this->whenLoaded('team')),
            'assigned_by' => new UserResource($this->whenLoaded('assigner')),
            'assigned_at' => $this->assigned_at?->toIso8601String(),
            'notes' => $this->notes,
            'is_active' => $this->is_active,
        ];
    }
}

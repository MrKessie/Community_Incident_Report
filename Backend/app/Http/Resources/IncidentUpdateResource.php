<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncidentUpdateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'update_type' => $this->update_type,
            'previous_status' => $this->previous_status,
            'new_status' => $this->new_status,
            'message' => $this->message,
            'is_public' => $this->is_public,
            'updater' => new UserResource($this->whenLoaded('updater')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

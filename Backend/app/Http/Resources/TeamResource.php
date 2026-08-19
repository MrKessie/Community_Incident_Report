<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'is_active' => $this->is_active,
            'members' => TeamMemberResource::collection($this->whenLoaded('members')),
            'users' => UserResource::collection($this->whenLoaded('users')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

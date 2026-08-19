<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'profile_photo' => $this->profile_photo,
            'is_active' => $this->is_active,
            'roles' => $this->getRoleNames(),
            'role' => $this->getRoleNames()->first() ?? 'reporter',
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

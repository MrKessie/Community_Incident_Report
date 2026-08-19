<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncidentListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference_number' => $this->reference_number,
            'title' => $this->title,
            'category_name' => $this->category?->name,
            'severity' => $this->severity,
            'status' => $this->status,
            'address' => $this->address,
            'is_anonymous' => $this->is_anonymous,
            'assigned_team' => $this->activeAssignment?->team?->name,
            'reported_at' => $this->reported_at?->toIso8601String(),
        ];
    }
}

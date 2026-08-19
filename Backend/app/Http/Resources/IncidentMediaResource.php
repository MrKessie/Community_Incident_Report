<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class IncidentMediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $filePath = $this->file_path;
        if ($filePath && !Str::startsWith($filePath, ['http://', 'https://'])) {
            $filePath = url($filePath);
        }

        return [
            'id' => $this->id,
            'file_path' => $filePath,
            'file_name' => $this->file_name,
            'file_type' => $this->file_type,
            'file_size' => $this->file_size,
            'mime_type' => $this->mime_type,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

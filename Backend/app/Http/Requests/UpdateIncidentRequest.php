<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|min:10',
            'severity' => 'sometimes|in:low,medium,high,critical',
            'status' => 'sometimes|in:submitted,under_review,verified,assigned,in_progress,resolved,closed,rejected',
            'admin_notes' => 'nullable|string',
        ];
    }
}

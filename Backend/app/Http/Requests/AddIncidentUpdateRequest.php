<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddIncidentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => 'required|string',
            'new_status' => 'nullable|in:in_progress,resolved,closed',
            'is_public' => 'boolean',
            'files.*' => 'nullable|file|max:51200',
        ];
    }
}

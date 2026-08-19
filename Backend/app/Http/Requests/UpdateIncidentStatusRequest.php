<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIncidentStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:submitted,under_review,verified,assigned,in_progress,resolved,closed,rejected',
            'reason' => 'nullable|string',
        ];
    }
}

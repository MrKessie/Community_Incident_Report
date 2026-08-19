<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'team_id' => 'required|exists:teams,id',
            'notes' => 'nullable|string',
        ];
    }
}

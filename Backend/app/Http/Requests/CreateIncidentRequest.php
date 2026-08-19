<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'category_id' => 'required|exists:incident_categories,id',
            'severity' => 'required|in:low,medium,high,critical',
            'incident_date' => 'required|date',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'address' => 'nullable|string',
            'is_anonymous' => 'boolean',
            'files.*' => 'nullable|file|max:51200',
        ];
    }
}

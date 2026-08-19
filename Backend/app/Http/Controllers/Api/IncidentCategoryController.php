<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IncidentCategory;
use Illuminate\Http\Request;

class IncidentCategoryController extends Controller
{
    public function index()
    {
        $categories = IncidentCategory::withCount('incidents')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:incident_categories,name',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'color' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $category = IncidentCategory::create($validated);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $category = IncidentCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:incident_categories,name,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'color' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category,
        ]);
    }

    public function destroy($id)
    {
        $category = IncidentCategory::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}

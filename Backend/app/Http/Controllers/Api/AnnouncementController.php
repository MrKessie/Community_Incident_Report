<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateAnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function active()
    {
        $announcements = Announcement::where('is_active', true)
            ->where(function($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->latest()
            ->get();

        return AnnouncementResource::collection($announcements);
    }

    public function index()
    {
        $announcements = Announcement::with('creator')->latest()->get();
        return AnnouncementResource::collection($announcements);
    }

    public function store(CreateAnnouncementRequest $request)
    {
        $validated = $request->validated();
        $announcement = Announcement::create([
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => $validated['type'],
            'created_by' => $request->user()->id,
            'is_active' => $validated['is_active'] ?? true,
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        return response()->json([
            'message' => 'Announcement broadcasted successfully',
            'announcement' => new AnnouncementResource($announcement),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'type' => 'sometimes|in:info,warning,danger,success',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $announcement->update($validated);
        return response()->json([
            'message' => 'Announcement updated',
            'announcement' => new AnnouncementResource($announcement),
        ]);
    }

    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted']);
    }
}

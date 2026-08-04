<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Incident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, Incident $incident): JsonResponse
    {
        if (! $this->canAccessIncident($request->user()->id, $request->user()->role?->role_name, $incident)) {
            abort(403, 'You are not allowed to view comments for this incident.');
        }

        return response()->json([
            'data' => $incident->comments()->with('user:id,name,email')->latest()->get(),
        ]);
    }

    public function store(Request $request, Incident $incident): JsonResponse
    {
        if (! $this->canAccessIncident($request->user()->id, $request->user()->role?->role_name, $incident)) {
            abort(403, 'You are not allowed to comment on this incident.');
        }

        $validated = $request->validate([
            'comment_text' => ['required', 'string', 'max:1500'],
        ]);

        $comment = Comment::create([
            'incident_id' => $incident->id,
            'user_id' => $request->user()->id,
            'comment_text' => $validated['comment_text'],
        ]);

        return response()->json([
            'message' => 'Comment added successfully.',
            'data' => $comment->load('user:id,name,email'),
        ], 201);
    }

    private function canAccessIncident(int $userId, ?string $roleName, Incident $incident): bool
    {
        if (in_array($roleName, ['Admin', 'Maintenance'], true)) {
            return true;
        }

        return $incident->user_id === $userId;
    }
}

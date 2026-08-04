<?php

namespace App\Http\Controllers\Api;

use App\Models\Assignment;
use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\StatusHistory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class IncidentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user()->load('role');

        $query = Incident::with([
            'user:id,name,email',
            'assignments.assignee:id,name,email',
            'statusHistory',
        ])
            ->latest();

        if (! $this->isPrivileged($user->role?->role_name)) {
            $query->where('user_id', $user->id);
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'description' => ['required', 'string', 'max:2000'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('incidents', 'public');
        }

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'Pending';

        $incident = Incident::create($validated);

        StatusHistory::create([
            'incident_id' => $incident->id,
            'status' => 'Pending',
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Incident submitted successfully.',
            'data' => $incident->load('user:id,name,email'),
        ], 201);
    }

    public function show(Request $request, Incident $incident): JsonResponse
    {
        if (! $this->canAccessIncident($request->user()->id, $request->user()->role?->role_name, $incident)) {
            abort(403, 'You are not allowed to view this incident.');
        }

        return response()->json([
            'data' => $incident->load([
                'user:id,name,email',
                'comments.user:id,name,email',
                'statusHistory',
                'assignments.assignee:id,name,email',
            ]),
        ]);
    }

    public function update(Request $request, Incident $incident): JsonResponse
    {
        if (! $this->canAccessIncident($request->user()->id, $request->user()->role?->role_name, $incident)) {
            abort(403, 'You are not allowed to update this incident.');
        }

        $validated = $request->validate([
            'description' => ['sometimes', 'required', 'string', 'max:2000'],
            'latitude' => ['sometimes', 'required', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'required', 'numeric', 'between:-180,180'],
            'status' => ['sometimes', 'required', 'in:Pending,In Progress,Resolved'],
            'photo' => ['sometimes', 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        if ($request->hasFile('photo')) {
            if ($incident->photo) {
                Storage::disk('public')->delete($incident->photo);
            }

            $validated['photo'] = $request->file('photo')->store('incidents', 'public');
        }

        $statusChanged = isset($validated['status']) && $validated['status'] !== $incident->status;

        $incident->update($validated);

        if ($statusChanged) {
            StatusHistory::create([
                'incident_id' => $incident->id,
                'status' => $incident->status,
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Incident updated successfully.',
            'data' => $incident->fresh()->load('user:id,name,email'),
        ]);
    }

    public function destroy(Request $request, Incident $incident): JsonResponse
    {
        $userRole = $request->user()->role?->role_name;
        $isOwner = $request->user()->id === $incident->user_id;

        if (! $isOwner && $userRole !== 'Admin') {
            abort(403, 'Only the owner or admin can delete an incident.');
        }

        if ($incident->photo) {
            Storage::disk('public')->delete($incident->photo);
        }

        $incident->delete();

        return response()->json([
            'message' => 'Incident deleted successfully.',
        ]);
    }

    public function updateStatus(Request $request, Incident $incident): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:Pending,In Progress,Resolved'],
        ]);

        if (! $this->canTransitionStatus($incident->status, $validated['status'])) {
            return response()->json([
                'message' => 'Invalid status transition. Follow Pending -> In Progress -> Resolved.',
            ], 422);
        }

        $incident->update([
            'status' => $validated['status'],
        ]);

        StatusHistory::create([
            'incident_id' => $incident->id,
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Incident status updated successfully.',
            'data' => $incident->fresh(),
        ]);
    }

    public function assign(Request $request, Incident $incident): JsonResponse
    {
        $validated = $request->validate([
            'assigned_to' => ['required', 'exists:users,id'],
        ]);

        $assignee = User::with('role')->findOrFail($validated['assigned_to']);

        if ($assignee->role?->role_name !== 'Maintenance') {
            return response()->json([
                'message' => 'Selected user is not a maintenance team member.',
            ], 422);
        }

        $assignment = Assignment::updateOrCreate([
            'incident_id' => $incident->id,
        ], [
            'incident_id' => $incident->id,
            'assigned_to' => $validated['assigned_to'],
        ]);

        return response()->json([
            'message' => 'Incident assigned successfully.',
            'data' => $assignment->load('assignee:id,name,email'),
        ], 201);
    }

    private function isPrivileged(?string $roleName): bool
    {
        return in_array($roleName, ['Admin', 'Maintenance'], true);
    }

    private function canAccessIncident(int $userId, ?string $roleName, Incident $incident): bool
    {
        if ($this->isPrivileged($roleName)) {
            return true;
        }

        return $incident->user_id === $userId;
    }

    private function canTransitionStatus(string $current, string $next): bool
    {
        if ($current === $next) {
            return true;
        }

        return match ($current) {
            'Pending' => $next === 'In Progress',
            'In Progress' => $next === 'Resolved',
            'Resolved' => false,
            default => false,
        };
    }
}

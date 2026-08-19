<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Http\Resources\TeamResource;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::with(['users', 'members.user', 'assignments.incident'])->get();
        return TeamResource::collection($teams);
    }

    public function store(CreateTeamRequest $request)
    {
        $team = Team::create($request->validated());
        return response()->json([
            'message' => 'Response team created successfully',
            'team' => new TeamResource($team),
        ], 201);
    }

    public function show($id)
    {
        $team = Team::with(['users', 'members.user', 'assignments.incident.category'])->findOrFail($id);
        return new TeamResource($team);
    }

    public function update(UpdateTeamRequest $request, $id)
    {
        $team = Team::findOrFail($id);
        $team->update($request->validated());
        return response()->json([
            'message' => 'Team updated successfully',
            'team' => new TeamResource($team),
        ]);
    }

    public function destroy($id)
    {
        $team = Team::findOrFail($id);
        $team->delete();
        return response()->json(['message' => 'Team deleted successfully']);
    }

    public function addMember(Request $request, $id)
    {
        $team = Team::findOrFail($id);
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'is_leader' => 'boolean',
        ]);

        $member = TeamMember::updateOrCreate(
            ['team_id' => $team->id, 'user_id' => $validated['user_id']],
            [
                'is_leader' => $validated['is_leader'] ?? false,
                'joined_at' => now(),
            ]
        );

        $user = User::find($validated['user_id']);
        if (!$user->hasRole('response_team')) {
            $user->assignRole('response_team');
        }

        return response()->json([
            'message' => 'Team member added',
            'member' => $member->load('user'),
        ]);
    }

    public function removeMember($id, $userId)
    {
        TeamMember::where('team_id', $id)->where('user_id', $userId)->delete();
        return response()->json(['message' => 'Member removed from team']);
    }

    public function assignLeader(Request $request, $id)
    {
        $request->validate(['user_id' => 'required|exists:users,id']);
        $team = Team::findOrFail($id);

        TeamMember::where('team_id', $team->id)->update(['is_leader' => false]);
        TeamMember::updateOrCreate(
            ['team_id' => $team->id, 'user_id' => $request->user_id],
            ['is_leader' => true, 'joined_at' => now()]
        );

        return response()->json(['message' => 'Team leader assigned successfully']);
    }
}

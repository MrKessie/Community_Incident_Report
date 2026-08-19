<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Incident;

class EnsureIncidentAssignedToTeam
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if ($user && ($user->hasRole('admin') || $user->hasRole('super_admin'))) {
            return $next($request);
        }

        $incidentId = $request->route('id') ?? $request->route('incident');
        if ($incidentId && $user) {
            $incident = Incident::find($incidentId);
            $userTeamIds = $user->teams->pluck('id')->toArray();
            $assignedTeamId = $incident?->activeAssignment?->team_id;

            if (!$assignedTeamId || !in_array($assignedTeamId, $userTeamIds)) {
                return response()->json(['message' => 'Unauthorized. Incident is not assigned to your response team.'], 403);
            }
        }

        return $next($request);
    }
}

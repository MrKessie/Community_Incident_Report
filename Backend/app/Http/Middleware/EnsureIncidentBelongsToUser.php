<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Incident;

class EnsureIncidentBelongsToUser
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if ($user && ($user->hasRole('admin') || $user->hasRole('super_admin'))) {
            return $next($request);
        }

        $incidentId = $request->route('id') ?? $request->route('incident');
        if ($incidentId) {
            $incident = Incident::find($incidentId);
            if ($incident && $incident->reporter_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized. Incident does not belong to you.'], 403);
            }
        }

        return $next($request);
    }
}

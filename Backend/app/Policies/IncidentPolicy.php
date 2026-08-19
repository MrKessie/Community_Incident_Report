<?php

namespace App\Policies;

use App\Models\Incident;
use App\Models\User;

class IncidentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Incident $incident): bool
    {
        if ($user->hasRole(['admin', 'super_admin'])) return true;
        if ($incident->reporter_id === $user->id) return true;
        if ($user->hasRole('response_team') && $incident->activeAssignment?->team?->users->contains($user->id)) return true;
        return false;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Incident $incident): bool
    {
        if ($user->hasRole(['admin', 'super_admin'])) return true;
        return ($incident->reporter_id === $user->id && $incident->status === 'submitted');
    }

    public function delete(User $user, Incident $incident): bool
    {
        if ($user->hasRole(['admin', 'super_admin'])) return true;
        return ($incident->reporter_id === $user->id && $incident->status === 'submitted');
    }
}

<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['admin', 'super_admin', 'response_team']);
    }

    public function manage(User $user): bool
    {
        return $user->hasRole(['admin', 'super_admin']);
    }
}

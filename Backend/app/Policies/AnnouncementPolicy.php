<?php

namespace App\Policies;

use App\Models\User;

class AnnouncementPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasRole(['admin', 'super_admin']);
    }
}

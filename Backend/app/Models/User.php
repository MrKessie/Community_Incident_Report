<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'profile_photo',
        'is_active',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class, 'reporter_id');
    }

    public function teamMemberships()
    {
        return $this->hasMany(TeamMember::class, 'user_id');
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_members')
                    ->withPivot('is_leader', 'joined_at')
                    ->withTimestamps();
    }

    public function incidentUpdates()
    {
        return $this->hasMany(IncidentUpdate::class, 'updated_by');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'user_id');
    }
}

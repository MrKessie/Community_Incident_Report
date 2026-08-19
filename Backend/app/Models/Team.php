<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function members()
    {
        return $this->hasMany(TeamMember::class, 'team_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'team_members')
                    ->withPivot('is_leader', 'joined_at')
                    ->withTimestamps();
    }

    public function assignments()
    {
        return $this->hasMany(IncidentAssignment::class, 'team_id');
    }
}

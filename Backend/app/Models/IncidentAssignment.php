<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncidentAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'incident_id',
        'team_id',
        'assigned_by',
        'assigned_at',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function incident()
    {
        return $this->belongsTo(Incident::class, 'incident_id');
    }

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}

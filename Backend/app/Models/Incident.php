<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'title',
        'description',
        'category_id',
        'reporter_id',
        'is_anonymous',
        'severity',
        'status',
        'latitude',
        'longitude',
        'address',
        'incident_date',
        'reported_at',
        'assigned_at',
        'resolved_at',
        'closed_at',
        'rejection_reason',
        'admin_notes',
        'is_duplicate',
        'duplicate_of',
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'is_duplicate' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'incident_date' => 'datetime',
        'reported_at' => 'datetime',
        'assigned_at' => 'datetime',
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(IncidentCategory::class, 'category_id');
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function duplicateOf()
    {
        return $this->belongsTo(Incident::class, 'duplicate_of');
    }

    public function duplicates()
    {
        return $this->hasMany(Incident::class, 'duplicate_of');
    }

    public function media()
    {
        return $this->hasMany(IncidentMedia::class, 'incident_id');
    }

    public function assignments()
    {
        return $this->hasMany(IncidentAssignment::class, 'incident_id');
    }

    public function activeAssignment()
    {
        return $this->hasOne(IncidentAssignment::class, 'incident_id')->where('is_active', true)->latestOfMany();
    }

    public function updates()
    {
        return $this->hasMany(IncidentUpdate::class, 'incident_id')->orderBy('created_at', 'desc');
    }

    public function statusHistories()
    {
        return $this->hasMany(IncidentStatusHistory::class, 'incident_id')->orderBy('created_at', 'desc');
    }

    public function feedback()
    {
        return $this->hasOne(Feedback::class, 'incident_id');
    }
}

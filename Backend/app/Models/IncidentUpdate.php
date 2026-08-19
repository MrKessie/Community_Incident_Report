<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncidentUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'incident_id',
        'updated_by',
        'update_type',
        'previous_status',
        'new_status',
        'message',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function incident()
    {
        return $this->belongsTo(Incident::class, 'incident_id');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}

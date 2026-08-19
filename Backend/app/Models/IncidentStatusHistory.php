<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncidentStatusHistory extends Model
{
    use HasFactory;

    protected $table = 'incident_status_history';

    protected $fillable = [
        'incident_id',
        'changed_by',
        'previous_status',
        'new_status',
        'reason',
    ];

    public function incident()
    {
        return $this->belongsTo(Incident::class, 'incident_id');
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}

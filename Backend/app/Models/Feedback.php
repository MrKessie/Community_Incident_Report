<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedback';

    protected $fillable = [
        'incident_id',
        'reporter_id',
        'was_resolved',
        'rating',
        'comment',
        'submitted_at',
    ];

    protected $casts = [
        'was_resolved' => 'boolean',
        'submitted_at' => 'datetime',
        'rating' => 'integer',
    ];

    public function incident()
    {
        return $this->belongsTo(Incident::class, 'incident_id');
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
}

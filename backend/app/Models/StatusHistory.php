<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class StatusHistory extends Model
{
    public const CREATED_AT = null;

    protected $table = 'status_histories';

    protected $fillable = [
        'incident_id',
        'status',
        'updated_at',
    ];

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }
}

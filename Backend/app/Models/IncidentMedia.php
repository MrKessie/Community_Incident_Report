<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncidentMedia extends Model
{
    use HasFactory;

    protected $table = 'incident_media';

    protected $fillable = [
        'incident_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'mime_type',
        'uploaded_by',
    ];

    public function incident()
    {
        return $this->belongsTo(Incident::class, 'incident_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}

<?php

namespace App\Services;

use App\Models\Incident;
use App\Models\IncidentMedia;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{
    public function validateMediaFile(UploadedFile $file): bool
    {
        $mime = $file->getClientMimeType();
        $size = $file->getSize();

        // Image validation: max 5MB
        if (Str::startsWith($mime, 'image/')) {
            return $size <= 5 * 1024 * 1024;
        }

        // Video validation: max 50MB
        if (Str::startsWith($mime, 'video/')) {
            return $size <= 50 * 1024 * 1024;
        }

        // Document validation: max 10MB
        return $size <= 10 * 1024 * 1024;
    }

    public function uploadMedia(Incident $incident, UploadedFile $file, $user = null): IncidentMedia
    {
        $mime = $file->getClientMimeType();
        $type = 'document';
        if (Str::startsWith($mime, 'image/')) $type = 'image';
        elseif (Str::startsWith($mime, 'video/')) $type = 'video';

        // Storage path: storage/app/public/incidents/{incident_id}/
        $folder = "incidents/{$incident->id}";
        $path = $file->store($folder, 'public');

        return IncidentMedia::create([
            'incident_id' => $incident->id,
            'file_path' => Storage::url($path),
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $type,
            'file_size' => $file->getSize(),
            'mime_type' => $mime,
            'uploaded_by' => $user ? $user->id : null,
        ]);
    }

    public function deleteMedia(IncidentMedia $media): bool
    {
        $relative = str_replace('/storage/', '', $media->file_path);
        if (Storage::disk('public')->exists($relative)) {
            Storage::disk('public')->delete($relative);
        }
        return $media->delete();
    }
}

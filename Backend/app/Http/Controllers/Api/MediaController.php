<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\IncidentMedia;
use App\Services\MediaService;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function __construct(protected MediaService $mediaService) {}

    public function upload(Request $request, $id)
    {
        $request->validate(['files.*' => 'required|file|max:51200']);
        $incident = Incident::findOrFail($id);

        $uploaded = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                if ($this->mediaService->validateMediaFile($file)) {
                    $uploaded[] = $this->mediaService->uploadMedia($incident, $file, $request->user());
                }
            }
        }

        return response()->json([
            'message' => 'Media uploaded successfully',
            'media' => $uploaded,
        ], 201);
    }

    public function destroy($id, $mediaId)
    {
        $media = IncidentMedia::where('incident_id', $id)->where('id', $mediaId)->firstOrFail();
        $this->mediaService->deleteMedia($media);

        return response()->json(['message' => 'Media file deleted']);
    }
}

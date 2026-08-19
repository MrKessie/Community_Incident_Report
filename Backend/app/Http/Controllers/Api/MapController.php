<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;

class MapController extends Controller
{
    public function incidents()
    {
        $incidents = Incident::with(['category', 'activeAssignment.team'])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->whereNotIn('status', ['rejected', 'duplicate'])
            ->get();

        return response()->json($incidents);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request, $incidentId)
    {
        $incident = Incident::findOrFail($incidentId);

        $validated = $request->validate([
            'was_resolved' => 'required|boolean',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $feedback = Feedback::updateOrCreate(
            [
                'incident_id' => $incident->id,
                'reporter_id' => $request->user()->id,
            ],
            [
                'was_resolved' => $validated['was_resolved'],
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
                'submitted_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Feedback submitted successfully. Thank you for helping improve community response!',
            'feedback' => $feedback->load('reporter'),
        ]);
    }

    public function index()
    {
        $feedback = Feedback::with(['incident', 'reporter'])->latest('submitted_at')->get();
        return response()->json($feedback);
    }
}

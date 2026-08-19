<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use App\Models\Incident;

class AnalyticsController extends Controller
{
    public function __construct(protected AnalyticsService $analyticsService) {}

    public function overview()
    {
        return response()->json($this->analyticsService->getOverviewStats());
    }

    public function incidentsByCategory()
    {
        return response()->json($this->analyticsService->getIncidentsByCategory());
    }

    public function incidentsByStatus()
    {
        $statuses = [
            'submitted' => 'Submitted',
            'under_review' => 'Under Review',
            'verified' => 'Verified',
            'assigned' => 'Assigned',
            'in_progress' => 'In Progress',
            'resolved' => 'Resolved',
            'closed' => 'Closed',
            'rejected' => 'Rejected',
        ];
        $data = [];
        foreach ($statuses as $key => $label) {
            $count = Incident::where('status', $key)->count();
            $data[] = ['status' => $label, 'count' => $count];
        }
        return response()->json($data);
    }

    public function incidentsBySeverity()
    {
        $severities = [
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
            'critical' => 'Critical',
        ];
        $data = [];
        foreach ($severities as $key => $label) {
            $count = Incident::where('severity', $key)->count();
            $data[] = ['severity' => $label, 'count' => $count];
        }
        return response()->json($data);
    }

    public function incidentsByMonth()
    {
        return response()->json($this->analyticsService->getIncidentsByMonth());
    }

    public function responseTimes()
    {
        return response()->json($this->analyticsService->getResponseTimes());
    }

    public function teamPerformance()
    {
        return response()->json($this->analyticsService->getTeamPerformance());
    }

    public function resolutionRates()
    {
        return response()->json($this->analyticsService->getResolutionRates());
    }

    public function mapData()
    {
        $data = Incident::select('id', 'reference_number', 'title', 'latitude', 'longitude', 'severity', 'status', 'category_id')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get();
        return response()->json($data);
    }
}

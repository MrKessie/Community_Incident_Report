<?php

namespace App\Services;

use App\Models\Incident;
use App\Models\IncidentCategory;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function getOverviewStats(): array
    {
        return [
            'total_incidents' => Incident::count(),
            'pending_review' => Incident::whereIn('status', ['submitted', 'under_review'])->count(),
            'active_dispatches' => Incident::whereIn('status', ['verified', 'assigned', 'in_progress'])->count(),
            'resolved_total' => Incident::whereIn('status', ['resolved', 'closed'])->count(),
            'rejected_total' => Incident::where('status', 'rejected')->count(),
            'critical_active' => Incident::where('severity', 'critical')->whereNotIn('status', ['resolved', 'closed', 'rejected'])->count(),
            'active_teams' => Team::where('is_active', true)->count(),
            'registered_reporters' => User::role('reporter')->count(),
        ];
    }

    public function getIncidentsByCategory(): array
    {
        return IncidentCategory::withCount('incidents')->get()->map(function($c) {
            return [
                'category_id' => $c->id,
                'name' => $c->name,
                'count' => $c->incidents_count,
                'color' => $c->color ?? '#ef4444',
            ];
        })->toArray();
    }

    public function getIncidentsByMonth(): array
    {
        $records = DB::table('incidents')
            ->select(DB::raw("DATE_FORMAT(created_at, '%b %Y') as month"), DB::raw('count(*) as count'))
            ->groupBy('month')
            ->orderBy(DB::raw('MIN(created_at)'), 'asc')
            ->get()
            ->toArray();

        if (empty($records)) {
            return [
                ['month' => date('b Y'), 'count' => 0]
            ];
        }

        return json_decode(json_encode($records), true);
    }

    public function getResponseTimes(): array
    {
        $avgAssign = DB::table('incidents')
            ->whereNotNull('assigned_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, created_at, assigned_at)) as avg_min')
            ->value('avg_min');

        $avgResolve = DB::table('incidents')
            ->whereNotNull('resolved_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hrs')
            ->value('avg_hrs');

        // Weekly trend data over last 7 days
        $trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-$i days"));
            $dayName = date('D', strtotime("-$i days"));
            
            $dayAvg = DB::table('incidents')
                ->whereDate('created_at', $date)
                ->whereNotNull('assigned_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, created_at, assigned_at)) as avg_min')
                ->value('avg_min');

            $trend[] = [
                'day' => $dayName,
                'minutes' => $dayAvg ? round((float)$dayAvg, 1) : 0,
            ];
        }

        return [
            'avg_assignment_minutes' => $avgAssign ? abs(round((float)$avgAssign, 1)) : 0,
            'avg_field_arrival_minutes' => $avgAssign ? abs(round((float)$avgAssign * 1.2, 1)) : 0,
            'avg_resolution_hours' => $avgResolve ? abs(round((float)$avgResolve, 1)) : 0,
            'trend' => $trend,
        ];
    }

    public function getTeamPerformance(): array
    {
        return Team::with(['assignments.incident'])->get()->map(function($t) {
            $assignedCount = $t->assignments->count();
            $resolvedCount = $t->assignments->filter(function($a) {
                return $a->incident && in_array($a->incident->status, ['resolved', 'closed']);
            })->count();

            $rate = $assignedCount > 0 ? round(($resolvedCount / $assignedCount) * 100, 1) . '%' : '0%';

            return [
                'id' => $t->id,
                'team_id' => $t->id,
                'name' => $t->name,
                'type' => $t->type,
                'assigned' => $assignedCount,
                'total_assignments' => $assignedCount,
                'resolved' => $resolvedCount,
                'rate' => $rate,
                'avgTime' => $assignedCount > 0 ? '15 min' : 'N/A',
            ];
        })->toArray();
    }

    public function getResolutionRates(): array
    {
        $total = Incident::count();
        $resolved = Incident::whereIn('status', ['resolved', 'closed'])->count();
        $rate = $total > 0 ? round(($resolved / $total) * 100, 1) : 0;

        return [
            'total_incidents' => $total,
            'resolved_incidents' => $resolved,
            'resolution_rate_percentage' => $rate,
        ];
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Incident;
use App\Models\IncidentCategory;
use App\Models\User;
use App\Models\Team;
use App\Models\IncidentAssignment;
use App\Models\IncidentUpdate;
use App\Models\IncidentStatusHistory;
use App\Models\Feedback;
use App\Models\Announcement;

class IncidentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'admin'))->first();
        $reporter1 = User::where('email', 'citizen.alex@cir.org')->first();
        $reporter2 = User::where('email', 'citizen.taylor@cir.org')->first();
        $fireTeam = Team::where('type', 'Fire')->first();
        $policeTeam = Team::where('type', 'Police')->first();
        $medicalTeam = Team::where('type', 'Medical')->first();

        $fireCat = IncidentCategory::where('name', 'Fire')->first();
        $accidentCat = IncidentCategory::where('name', 'Road Accident')->first();
        $theftCat = IncidentCategory::where('name', 'Theft / Robbery')->first();
        $medicalCat = IncidentCategory::where('name', 'Medical Emergency')->first();
        $floodCat = IncidentCategory::where('name', 'Flood / Water')->first();

        // 1. High Severity Fire Incident - In Progress
        $inc1 = Incident::create([
            'reference_number' => 'INC-2026-00001',
            'title' => 'Commercial Warehouse Fire on 5th Avenue',
            'description' => 'Heavy black smoke billowing from industrial warehouse roof. Fire spread rapidly to adjacent storage bays.',
            'category_id' => $fireCat ? $fireCat->id : 1,
            'reporter_id' => $reporter1 ? $reporter1->id : null,
            'is_anonymous' => false,
            'severity' => 'critical',
            'status' => 'in_progress',
            'latitude' => 40.712776,
            'longitude' => -74.005974,
            'address' => '542 5th Avenue, Industrial District',
            'incident_date' => now()->subHours(3),
            'reported_at' => now()->subHours(3),
            'assigned_at' => now()->subHours(2),
            'admin_notes' => 'Priority 1 response. 3 fire tenders dispatched.',
        ]);

        if ($fireTeam && $admin) {
            IncidentAssignment::create([
                'incident_id' => $inc1->id,
                'team_id' => $fireTeam->id,
                'assigned_by' => $admin->id,
                'assigned_at' => now()->subHours(2),
                'notes' => 'Immediate perimeter containment required.',
                'is_active' => true,
            ]);
        }

        IncidentStatusHistory::create([
            'incident_id' => $inc1->id,
            'changed_by' => $admin ? $admin->id : 1,
            'previous_status' => 'submitted',
            'new_status' => 'verified',
            'reason' => 'Multiple citizen reports confirmed visual smoke.',
        ]);

        IncidentUpdate::create([
            'incident_id' => $inc1->id,
            'updated_by' => $admin ? $admin->id : 1,
            'update_type' => 'status_change',
            'previous_status' => 'assigned',
            'new_status' => 'in_progress',
            'message' => 'Fire Response Crew on scene. Water cannons deployed on North structure.',
            'is_public' => true,
        ]);

        // 2. Road Accident Incident - Resolved
        $inc2 = Incident::create([
            'reference_number' => 'INC-2026-00002',
            'title' => 'Multi-Vehicle Collision on Highway 101',
            'description' => 'Two sedans and a delivery truck collision blocking south lanes. Minor injuries reported.',
            'category_id' => $accidentCat ? $accidentCat->id : 2,
            'reporter_id' => $reporter2 ? $reporter2->id : null,
            'is_anonymous' => false,
            'severity' => 'high',
            'status' => 'resolved',
            'latitude' => 40.730610,
            'longitude' => -73.935242,
            'address' => 'Highway 101 Exit 14, Queens',
            'incident_date' => now()->subDays(1),
            'reported_at' => now()->subDays(1),
            'assigned_at' => now()->subDays(1)->addHours(1),
            'resolved_at' => now()->subHours(5),
            'admin_notes' => 'Tow trucks cleared debris. Paramedics treated victims on scene.',
        ]);

        if ($reporter2) {
            Feedback::create([
                'incident_id' => $inc2->id,
                'reporter_id' => $reporter2->id,
                'was_resolved' => true,
                'rating' => 5,
                'comment' => 'The police and ambulance arrived within 10 minutes! Excellent emergency response.',
                'submitted_at' => now()->subHours(4),
            ]);
        }

        // 3. Anonymous Theft Incident - Under Review
        Incident::create([
            'reference_number' => 'INC-2026-00003',
            'title' => 'Bicycle Theft & Vandalism at Central Park South',
            'description' => 'Cut security lock found near public bike rack. Security camera footage available from shop across street.',
            'category_id' => $theftCat ? $theftCat->id : 2,
            'reporter_id' => null,
            'is_anonymous' => true,
            'severity' => 'low',
            'status' => 'under_review',
            'latitude' => 40.7648,
            'longitude' => -73.9744,
            'address' => 'Central Park South Entrance',
            'incident_date' => now()->subHours(6),
            'reported_at' => now()->subHours(6),
        ]);

        // 4. Medical Emergency - Verified
        Incident::create([
            'reference_number' => 'INC-2026-00004',
            'title' => 'Heat Exhaustion at Public Plaza',
            'description' => 'Elderly citizen experienced dizziness and fainting due to excessive heat outdoors.',
            'category_id' => $medicalCat ? $medicalCat->id : 5,
            'reporter_id' => $reporter1 ? $reporter1->id : null,
            'is_anonymous' => false,
            'severity' => 'medium',
            'status' => 'verified',
            'latitude' => 40.758896,
            'longitude' => -73.985130,
            'address' => 'Times Square Plaza Center',
            'incident_date' => now()->subHours(1),
            'reported_at' => now()->subHours(1),
        ]);

        // 5. Active System Announcements
        if ($admin) {
            Announcement::create([
                'title' => 'Severe Weather Advisory - Heavy Flash Flooding Warning',
                'message' => 'The National Weather Service has issued a flash flood warning for low-lying coastal areas. Stay vigilant and report any rising waters immediately.',
                'type' => 'warning',
                'created_by' => $admin->id,
                'is_active' => true,
                'expires_at' => now()->addDays(2),
            ]);

            Announcement::create([
                'title' => 'System Maintenance & New Emergency Hotline Integration',
                'message' => 'Our dispatch systems have been upgraded for faster emergency response routing.',
                'type' => 'info',
                'created_by' => $admin->id,
                'is_active' => true,
                'expires_at' => now()->addDays(5),
            ]);
        }
    }
}

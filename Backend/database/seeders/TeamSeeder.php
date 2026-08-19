<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $teams = [
            [
                'name' => 'Metro Fire Rescue',
                'description' => 'First responder fire suppression and heavy rescue operational unit.',
                'type' => 'Fire',
                'is_active' => true,
            ],
            [
                'name' => 'Police Rapid Response Unit',
                'description' => 'Law enforcement rapid dispatch and crime incident management.',
                'type' => 'Police',
                'is_active' => true,
            ],
            [
                'name' => 'Emergency Medical Services',
                'description' => 'Paramedic and emergency ambulance rescue services.',
                'type' => 'Medical',
                'is_active' => true,
            ],
            [
                'name' => 'Disaster & Flood Relief Squad',
                'description' => 'Specialized water rescue, evacuation, and environmental mitigation unit.',
                'type' => 'Flood',
                'is_active' => true,
            ],
        ];

        foreach ($teams as $teamData) {
            Team::firstOrCreate(['name' => $teamData['name']], $teamData);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Team;
use App\Models\TeamMember;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Default Seeded Super Admin
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@community.com'],
            [
                'name' => 'Super Admin',
                'phone' => '+15550000001',
                'password' => Hash::make('Benben@10.'),
                'is_active' => true,
            ]
        );
        $superAdmin->assignRole('super_admin');

        // 2. Default Seeded Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@community.com'],
            [
                'name' => 'System Admin',
                'phone' => '+15550000002',
                'password' => Hash::make('Password@123'),
                'is_active' => true,
            ]
        );
        $admin->assignRole('admin');

        // Legacy compatibility accounts for frontend demo buttons
        User::firstOrCreate(
            ['email' => 'superadmin@cir.org'],
            [
                'name' => 'System Super Admin',
                'phone' => '+15550000001',
                'password' => Hash::make('Password@123'),
                'is_active' => true,
            ]
        )->assignRole('super_admin');

        User::firstOrCreate(
            ['email' => 'admin@cir.org'],
            [
                'name' => 'Commander Sarah Jenkins',
                'phone' => '+15550000002',
                'password' => Hash::make('Password@123'),
                'is_active' => true,
            ]
        )->assignRole('admin');

        // 3. Response Team Leaders
        $fireTeam = Team::where('type', 'Fire')->first();
        $policeTeam = Team::where('type', 'Police')->first();
        $medicalTeam = Team::where('type', 'Medical')->first();
        $floodTeam = Team::where('type', 'Flood')->first();

        $fireLeader = User::firstOrCreate(
            ['email' => 'fire.captain@cir.org'],
            [
                'name' => 'Captain David Vance',
                'phone' => '+15550000003',
                'password' => Hash::make('Password@123'),
                'is_active' => true,
            ]
        );
        $fireLeader->assignRole('response_team');
        if ($fireTeam) {
            TeamMember::firstOrCreate(
                ['team_id' => $fireTeam->id, 'user_id' => $fireLeader->id],
                ['is_leader' => true, 'joined_at' => now()]
            );
        }

        $policeLeader = User::firstOrCreate(
            ['email' => 'police.lead@cir.org'],
            [
                'name' => 'Inspector Marcus Reed',
                'phone' => '+15550000004',
                'password' => Hash::make('Password@123'),
                'is_active' => true,
            ]
        );
        $policeLeader->assignRole('response_team');
        if ($policeTeam) {
            TeamMember::firstOrCreate(
                ['team_id' => $policeTeam->id, 'user_id' => $policeLeader->id],
                ['is_leader' => true, 'joined_at' => now()]
            );
        }

        // 4. Community Reporters
        $reporter1 = User::firstOrCreate(
            ['email' => 'citizen.alex@cir.org'],
            [
                'name' => 'Alex Morgan',
                'phone' => '+15550000010',
                'password' => Hash::make('Password@123'),
                'is_active' => true,
            ]
        );
        $reporter1->assignRole('reporter');

        $reporter2 = User::firstOrCreate(
            ['email' => 'citizen.taylor@cir.org'],
            [
                'name' => 'Taylor Swift',
                'phone' => '+15550000011',
                'password' => Hash::make('Password@123'),
                'is_active' => true,
            ]
        );
        $reporter2->assignRole('reporter');
    }
}

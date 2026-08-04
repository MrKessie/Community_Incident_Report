<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $citizenRole = Role::where('role_name', 'Citizen')->firstOrFail();
        $adminRole = Role::where('role_name', 'Admin')->firstOrFail();
        $maintenanceRole = Role::where('role_name', 'Maintenance')->firstOrFail();

        User::updateOrCreate(
            ['email' => 'citizen@example.com'],
            [
                'name' => 'Citizen Demo',
                'password' => Hash::make('password123'),
                'role_id' => $citizenRole->id,
                'phone_number' => '+233200000001',
            ],
        );

        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Demo',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
                'phone_number' => '+233200000002',
            ],
        );

        User::updateOrCreate(
            ['email' => 'maintenance@example.com'],
            [
                'name' => 'Maintenance Demo',
                'password' => Hash::make('password123'),
                'role_id' => $maintenanceRole->id,
                'phone_number' => '+233200000003',
            ],
        );
    }
}

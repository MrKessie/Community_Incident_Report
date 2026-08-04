<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Citizen', 'Admin', 'Maintenance'] as $roleName) {
            Role::firstOrCreate([
                'role_name' => $roleName,
            ]);
        }
    }
}

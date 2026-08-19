<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\IncidentCategory;

class IncidentCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Fire', 'description' => 'Structure fires, bushfires, electrical fires, and smoke hazard alerts.', 'icon' => 'Flame', 'color' => '#ef4444'],
            ['name' => 'Theft / Robbery', 'description' => 'Burglary, armed robbery, vehicle theft, and petty larceny.', 'icon' => 'ShieldAlert', 'color' => '#f97316'],
            ['name' => 'Road Accident', 'description' => 'Vehicular collisions, traffic blockages, pedestrian accidents.', 'icon' => 'Car', 'color' => '#eab308'],
            ['name' => 'Flood / Water', 'description' => 'Rising floodwaters, drainage overflow, water supply burst.', 'icon' => 'Droplets', 'color' => '#3b82f6'],
            ['name' => 'Medical Emergency', 'description' => 'Health distress, collapsed individuals, urgent medical assistance needed.', 'icon' => 'Activity', 'color' => '#ec4899'],
            ['name' => 'Violence / Assault', 'description' => 'Physical brawls, domestic altercations, public safety threats.', 'icon' => 'AlertTriangle', 'color' => '#dc2626'],
            ['name' => 'Infrastructure Damage', 'description' => 'Potholes, fallen power lines, broken streetlights, bridge damage.', 'icon' => 'Hammer', 'color' => '#8b5cf6'],
            ['name' => 'Environmental Hazard', 'description' => 'Chemical spills, illegal dumping, toxic fumes, gas leaks.', 'icon' => 'Trees', 'color' => '#10b981'],
            ['name' => 'Missing Person', 'description' => 'Lost children, elderly individuals, missing community members.', 'icon' => 'UserCheck', 'color' => '#6366f1'],
            ['name' => 'Vandalism', 'description' => 'Graffiti, destruction of public or private property.', 'icon' => 'EyeOff', 'color' => '#64748b'],
            ['name' => 'Other', 'description' => 'General community concerns and uncategorized incidents.', 'icon' => 'HelpCircle', 'color' => '#94a3b8'],
        ];

        foreach ($categories as $category) {
            IncidentCategory::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}

<?php

use Illuminate\Support\Facades\Schedule;
use App\Jobs\EscalateUnassignedIncidentsJob;
use App\Jobs\EscalateInactiveAssignedIncidentsJob;

// Escalation Scheduler for unassigned and inactive emergency incidents
Schedule::job(new EscalateUnassignedIncidentsJob)->everyThirtyMinutes();
Schedule::job(new EscalateInactiveAssignedIncidentsJob)->hourly();

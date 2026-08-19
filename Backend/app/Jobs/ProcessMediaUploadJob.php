<?php

namespace App\Jobs;

use App\Models\IncidentMedia;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessMediaUploadJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public IncidentMedia $media) {}

    public function handle(): void
    {
        // Media processing optimization (e.g. thumbnail generation, virus scan)
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number', 50)->unique();
            $table->string('title');
            $table->text('description');
            $table->foreignId('category_id')->constrained('incident_categories')->onDelete('cascade');
            $table->foreignId('reporter_id')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('is_anonymous')->default(false);
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('status', [
                'submitted',
                'under_review',
                'verified',
                'assigned',
                'in_progress',
                'resolved',
                'closed',
                'rejected'
            ])->default('submitted');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('address')->nullable();
            $table->dateTime('incident_date');
            $table->timestamp('reported_at')->useCurrent();
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('admin_notes')->nullable();
            $table->boolean('is_duplicate')->default(false);
            $table->foreignId('duplicate_of')->nullable()->constrained('incidents')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};

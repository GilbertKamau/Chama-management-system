<?php
/* Modified by Antigravity */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('chamas', function (Blueprint $table) {
            $table->decimal('contribution_amount', 15, 2)->default(500);
            $table->enum('contribution_frequency', ['weekly', 'monthly'])->default('monthly');
            $table->string('contribution_day')->nullable(); // e.g. "Monday" or "30"
            $table->decimal('late_fine_amount', 15, 2)->default(0);
            $table->integer('max_loan_multiplier')->default(3); // e.g. 3x savings
            $table->boolean('has_onboarded')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chamas', function (Blueprint $table) {
            $table->dropColumn([
                'contribution_amount',
                'contribution_frequency',
                'contribution_day',
                'late_fine_amount',
                'max_loan_multiplier',
                'has_onboarded'
            ]);
        });
    }
};

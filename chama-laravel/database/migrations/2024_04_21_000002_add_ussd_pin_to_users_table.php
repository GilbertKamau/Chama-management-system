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
        Schema::table('users', function (Blueprint $col) {
            $col->string('ussd_pin')->nullable()->after('password');
            $col->boolean('has_set_pin')->default(false)->after('ussd_pin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $col) {
            $col->dropColumn(['ussd_pin', 'has_set_pin']);
        });
    }
};

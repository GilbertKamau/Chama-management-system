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
            $table->string('bank_name')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('mpesa_shortcode')->nullable();
            $table->text('mpesa_passkey')->nullable(); // Encrypted
            $table->string('mpesa_consumer_key')->nullable(); // Encrypted
            $table->text('mpesa_consumer_secret')->nullable(); // Encrypted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chamas', function (Blueprint $table) {
            $table->dropColumn([
                'bank_name', 
                'bank_account', 
                'mpesa_shortcode', 
                'mpesa_passkey',
                'mpesa_consumer_key',
                'mpesa_consumer_secret'
            ]);
        });
    }
};

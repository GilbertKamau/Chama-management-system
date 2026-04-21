<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('contributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('chama_id')->constrained();
            $table->decimal('amount', 15, 2);
            $table->timestamp('contribution_date')->useCurrent();
            $table->text('description')->nullable();
            $table->enum('status', ['approved', 'flagged'])->default('approved');
            $table->text('flag_reason')->nullable();
            $table->timestamps();
        });

        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('chama_id')->constrained();
            $table->decimal('amount', 15, 2);
            $table->integer('payment_duration'); // in months
            $table->string('mobile_number');
            $table->enum('status', ['Pending', 'Approved', 'Rejected', 'Disbursed', 'Paid', 'flagged'])->default('Pending');
            $table->text('flag_reason')->nullable();
            $table->timestamp('loan_date')->useCurrent();
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('chama_id')->constrained();
            $table->decimal('amount', 15, 2);
            $table->string('payment_reference');
            $table->string('mobile_number');
            $table->enum('status', ['approved', 'flagged'])->default('approved');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('loans');
        Schema::dropIfExists('contributions');
    }
};

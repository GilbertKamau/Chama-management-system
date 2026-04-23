<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chama extends Model
{
    protected $fillable = [
        'name',
        'constitution_pdf_path',
        'ai_analysis_status',
        'bank_name',
        'bank_account',
        'mpesa_shortcode',
        'mpesa_passkey',
        'mpesa_consumer_key',
        'mpesa_consumer_secret',
        'contribution_amount',
        'contribution_frequency',
        'contribution_day',
        'late_fine_amount',
        'max_loan_multiplier',
        'has_onboarded',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'mpesa_passkey' => 'encrypted',
        'mpesa_consumer_secret' => 'encrypted',
        'has_onboarded' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}

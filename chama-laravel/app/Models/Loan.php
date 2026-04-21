<?php

namespace App\Models;

use App\Traits\BelongsToChama;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use BelongsToChama;

    protected $fillable = [
        'user_id',
        'chama_id',
        'amount',
        'payment_duration',
        'mobile_number',
        'status',
        'flag_reason',
        'loan_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

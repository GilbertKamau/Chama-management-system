<?php

namespace App\Models;

use App\Traits\BelongsToChama;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use BelongsToChama;

    protected $fillable = [
        'user_id',
        'chama_id',
        'amount',
        'payment_reference',
        'mobile_number',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

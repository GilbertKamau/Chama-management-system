<?php

namespace App\Models;

use App\Traits\BelongsToChama;
use Illuminate\Database\Eloquent\Model;

class Contribution extends Model
{
    use BelongsToChama;

    protected $fillable = [
        'user_id',
        'chama_id',
        'amount',
        'contribution_date',
        'description',
        'status',
        'flag_reason',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

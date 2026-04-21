<?php

namespace App\Models;

use App\Traits\BelongsToChama;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, BelongsToChama;

    protected $fillable = [
        'chama_id',
        'email',
        'password',
        'phone_number',
        'ussd_pin',
        'has_set_pin',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function chama()
    {
        return $this->belongsTo(Chama::class);
    }
}

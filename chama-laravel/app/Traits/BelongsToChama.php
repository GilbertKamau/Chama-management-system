<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToChama
{
    protected static function bootBelongsToChama()
    {
        static::creating(function ($model) {
            if (Auth::check() && ! $model->chama_id) {
                $model->chama_id = Auth::user()->chama_id;
            }
        });

        static::addGlobalScope('chama_isolation', function (Builder $builder) {
            if (Auth::check() && Auth::user()->role !== 'super_admin') {
                $builder->where('chama_id', Auth::user()->chama_id);
            }
        });
    }
}

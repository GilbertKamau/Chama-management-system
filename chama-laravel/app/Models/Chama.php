<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chama extends Model
{
    protected $fillable = [
        'name',
        'constitution_pdf_path',
        'ai_analysis_status',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}

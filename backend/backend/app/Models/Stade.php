<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stade extends Model
{
    use HasFactory;

    protected $table = 'stades';

    protected $fillable = [
        'nom',
        'capacite',
        'adresse',
    ];

    public function matchs()
    {
        return $this->hasMany(FootMatch::class);
    }
}

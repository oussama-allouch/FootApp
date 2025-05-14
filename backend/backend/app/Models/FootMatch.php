<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FootMatch extends Model
{
    use HasFactory;

    protected $table = 'footmatchs';

    protected $fillable = [
        'equipe1',
        'equipe2',
        'date_heure',
        'stade_id',
        'statut',
    ];

    public function stade()
    {
        return $this->belongsTo(Stade::class,'stade_id');
    }

    public function billets()
    {
        return $this->hasMany(Billet::class,'match_id');
    }
}

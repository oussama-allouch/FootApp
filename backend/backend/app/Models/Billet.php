<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Billet extends Model
{
    use HasFactory;

    protected $table = 'billets';

    protected $fillable = [
        'match_id',
        'user_id',
        'prix',
        'statut', // "valide" ou "utilisé"
        'code_QR',
        'place',
    ];

    public function match()
    {
        return $this->belongsTo(FootMatch::class,'match_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

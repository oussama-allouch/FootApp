<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $table = 'paiements';

    protected $fillable = [
        'billet_id',
        'user_id',
        'montant',
        'methode', // ex: "carte bancaire", "PayPal", "Stripe"
        'statut', // "en attente", "réussi", "échoué"
    ];

    public function billet()
    {
        return $this->belongsTo(Billet::class);
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

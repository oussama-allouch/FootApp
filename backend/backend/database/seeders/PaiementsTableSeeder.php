<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Paiement;
use App\Models\Billet;
use App\Models\User;
use Carbon\Carbon;

class PaiementsTableSeeder extends Seeder
{
    public function run()
    {
        // Vérifier s'il y a des utilisateurs et des billets
        $user = User::first();
        $billet = Billet::first();

        if (!$user || !$billet) {
            // Si aucun utilisateur ou billet trouvé, afficher un message et arrêter
            echo "Aucun utilisateur ou billet trouvé. Vérifiez vos seeders.\n";
            return;
        }

        // Créer un paiement
        Paiement::create([
            'user_id' => $user->id,
            'billet_id' => $billet->id,
            'montant' => $billet->prix,
            'methode' => 'paypal',
            'statut' => 'confirmé', // ou 'en attente'
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}

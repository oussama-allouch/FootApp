<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Billet;
use App\Models\User;
use App\Models\Footmatch;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BilletsTableSeeder extends Seeder
{
    public function run()
    {
        // Récupérer un utilisateur et un match existants
        $user = User::first();  // Choisir un utilisateur existant
        $match = Footmatch::first();  // Choisir un match existant

        Billet::create([
            'user_id' => $user->id,
            'match_id' => $match->id,
            'place' => 5, // Par exemple, place 5
            'prix' => 25.50,  // Prix du billet
            'code_QR' => Str::random(10),  // Générer un QR code unique
            'statut' => 'valide',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Ajouter d'autres billets si nécessaire
        Billet::create([
            'user_id' => $user->id,
            'match_id' => $match->id,
            'place' => 10, // Par exemple, place 10
            'prix' => 30.00,  // Prix du billet
            'code_QR' => Str::random(10),  // Générer un QR code unique
            'statut' => 'utilisé',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}

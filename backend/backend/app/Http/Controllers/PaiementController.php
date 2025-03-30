<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Paiement;
use App\Models\Billet;
use App\Models\User;
use Illuminate\Support\Carbon;

class PaiementController extends Controller
{
    public function payer(Request $request)
    {
        // Validation des données entrantes
        $request->validate([
            'user_id' => 'required|exists:users,id',       
            'billet_id' => 'required|exists:billets,id',       
            'montant' => 'required|numeric|min:0',             
            'methode' => 'required|in:carte,paypal,stripe',   
        ]);

        // Vérifier si le billet existe et s'il n'est pas déjà utilisé
        $billet = Billet::find($request->billet_id);

        if (!$billet || $billet->statut == 'utilisé') {
            return response()->json(['error' => 'Le billet a déjà été utilisé ou est invalide.'], 400);
        }

        // Création du paiement
        $paiement = Paiement::create([
            'user_id' => $request->user_id,              
            'billet_id' => $request->billet_id,                
            'montant' => $request->montant,    
            'methode' => $request->methode,    
            'statut' => 'confirmé', // On considère que le paiement est validé  
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Mettre à jour le statut du billet en "validé"
        $billet->update(['statut' => 'valide']);

        // Retourner la réponse
        return response()->json([
            'message' => 'Paiement effectué avec succès', 
            'paiement' => $paiement
        ], 201);
    }
}

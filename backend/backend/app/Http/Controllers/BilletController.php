<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FootMatch;
use App\Models\Billet;
use App\Models\Stade;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class BilletController extends Controller
{
    public function acheterBillet(Request $request)
    {
        // Validation des données d'entrée
        $request->validate([
            'match_id' => 'required|exists:footmatchs,id',
            'user_id' => 'required|exists:users,id',
            'place' => 'required|integer|min:1',
        ]);
    
        // Récupérer le match
        $match = Footmatch::findOrFail($request->match_id);
    
        // Vérifier que le match est toujours disponible
        if ($match->statut !== 'à venir') {
            return response()->json(['error' => 'Ce match n\'est plus disponible'], 400);
        }
    
        // Vérifier le nombre de places restantes
        $stade = Stade::findOrFail($match->stade_id);
        $placesRestantes = $stade->capacite - Billet::where('match_id', $match->id)->sum('place');

        if ($request->place > $placesRestantes) {
            return response()->json(['error' => 'Il ne reste que ' . $placesRestantes . ' places disponibles'], 400);
        }
    
        // Définir un prix (exemple : fixe à 50€ ou dépend du match)
        $prix = 50; // Tu peux modifier cette logique selon les règles de tarification
    
        try {
            DB::beginTransaction();
    
            // Générer un code QR unique (chaîne aléatoire)
            $codeQR = Str::uuid()->toString(); // Utilisation d'un UUID pour plus d'unicité
    
            // Création du billet
            $billet = Billet::create([
                'match_id' => $request->match_id,
                'user_id' => $request->user_id,
                'place' => $request->place,
                'prix' => $prix,
                'code_QR' => $codeQR,
                'statut' => 'validé',
            ]);
    
            DB::commit();
    
            return response()->json([
                'message' => 'Billet acheté avec succès',
                'billet' => $billet
            ], 201);
    
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Une erreur est survenue: ' . $e->getMessage()], 500);
        }
    }

    public function mesBillets($user_id)
    {
        $billets = Billet::where('user_id', $user_id)->with('match.stade')->get();
    
        if ($billets->isEmpty()) {
            return response()->json(["message" => "Tu n'as pas de billets."], 400);
        }
    
        return response()->json($billets);
    }
    public function telechargerBillet($id)
{
    $billet = Billet::find($id);

    if (!$billet) {
        return response()->json(['error' => 'Billet non trouvé'], 404);
    }

    return response()->json(['qr_code' => $billet->code_QR]);
}
    

}

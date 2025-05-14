<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FootMatch;
use App\Models\Stade;



class MatchController extends Controller
{
    public function getAvailableMatches()
    {
        // Récupérer les matchs qui sont "à venir"
        $matches = Footmatch::where('statut', 'à venir')->with('stade')->get();

        // Retourner les données en format JSON
        return response()->json($matches);
    }
    public function getMatchDetails($id)
{
    $match = Footmatch::with('stade')->find($id);

    if (!$match) {
        return response()->json(['error' => 'Match non trouvé'], 404);
    }

    return response()->json($match);
}

public function getPopularMatches()
{
    $matches = FootMatch::with(['stade', 'billets'])
        ->withCount(['billets as tickets_count' => function($query) {
            $query->where('statut', 'valide'); // Seulement les billets valides
        }])
        ->whereHas('billets', function($query) {
            $query->where('statut', 'valide'); // Assurer que des billets valides existent
        })
        ->orderByDesc('tickets_count')
        ->limit(3)
        ->get()
        ->map(function ($match) {
            return [
                'id' => $match->id,
                'equipe1' => $match->equipe1,
                'equipe2' => $match->equipe2,
                'date_heure' => $match->date_heure,
                'stade' => [
                    'nom' => $match->stade->nom,
                    'capacite' => $match->stade->capacite,
                    'adresse' => $match->stade->adresse
                ],
                'tickets_count' => $match->tickets_count,
                'places_restantes' => $match->stade->capacite - $match->billets->count()
            ];
        });

    return response()->json($matches);
}



}

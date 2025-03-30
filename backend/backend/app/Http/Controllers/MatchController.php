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


}

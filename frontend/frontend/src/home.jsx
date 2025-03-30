import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Matchs de Football Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map(match => (
          <Link to={`/matches/${match.id}`} key={match.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-xl font-semibold text-gray-800">{match.equipe_home} vs {match.equipe_away}</div>
            <div className="text-gray-600 mt-2">{match.stade.nom}</div>
            <div className="text-green-600 font-bold mt-2">{match.date_match}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
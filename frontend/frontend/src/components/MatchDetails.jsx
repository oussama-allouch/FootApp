import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');

  useEffect(() => {
    fetch(`/api/matches/${id}`)
      .then(res => res.json())
      .then(data => setMatch(data))
      .catch(console.error);
  }, [id]);

  const handlePurchase = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    navigate(`/payment/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      {match && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              {match.equipe_home} vs {match.equipe_away}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><span className="font-semibold">Stade :</span> {match.stade.nom}</p>
                <p className="text-gray-600"><span className="font-semibold">Date :</span> {new Date(match.date_match).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Sélectionner une place :</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={selectedSeat}
                  onChange={(e) => setSelectedSeat(e.target.value)}>
                  <option value="">Choisir une place</option>
                  {match.stade.places_disponibles.map(place => (
                    <option key={place.id} value={place.id}>{place.section} - {place.numero}</option>
                  ))}
                </select>
              </div>
            </div>
            <button 
              onClick={handlePurchase}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
              Acheter ce billet
            </button>
          </div>
        </>
      )}
    </div>
  );
}
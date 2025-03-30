import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Payment() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    methode: 'carte',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/paiements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          billet_id: matchId, // À adapter selon votre logique
          methode: paymentData.methode,
          montant: 500 // Récupérer le montant réel depuis l'API
        })
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/ticket/${data.paiement.billet_id}`);
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Paiement</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Méthode de paiement</label>
            <select 
              className="w-full p-2 border rounded"
              value={paymentData.methode}
              onChange={(e) => setPaymentData({...paymentData, methode: e.target.value})}>
              <option value="carte">Carte de crédit</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          
          {paymentData.methode === 'carte' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Numéro de carte</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              {/* Ajouter les autres champs de carte */}
            </>
          )}

          <button 
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">
            Payer maintenant
          </button>
        </form>
      </div>
    </div>
  );
}
import { useParams } from 'react-router-dom';

export default function QRCode() {
  const { billetId } = useParams();

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Votre billet numérique</h2>
        <div className="mb-4 p-4 bg-gray-100 rounded">
          {/* Intégrer un vrai générateur QR Code ici */}
          <div className="text-gray-500">[QR Code Placeholder]</div>
          <div className="text-sm text-gray-600 mt-2">ID: {billetId}</div>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Télécharger le billet
        </button>
      </div>
    </div>
  );
}
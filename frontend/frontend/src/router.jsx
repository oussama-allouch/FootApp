import { Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home'; // Corrigez la casse (`home` → `Home`)
import Login from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import AdminDashboard from './components/AdminDashboard';
import MatchDetails from './components/MatchDetails';
import Payment from './components/Payment';
import QRCode from './components/QRCode';
import NotFound from './components/NotFound'; // Nouveau composant pour les 404

const RouterComponent = () => {
  return (
    <DarkModeProvider>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* Routes protégées (utilisateur) */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matches/:id" element={<MatchDetails />} />
          <Route path="/payment/:matchId" element={<Payment />} />
          <Route path="/tickets/:billetId" element={<QRCode />} />
        </Route>

        {/* Routes protégées (admin uniquement) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Gestion des 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DarkModeProvider>
  );
};

export default RouterComponent;
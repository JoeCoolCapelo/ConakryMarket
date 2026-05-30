import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import NewReview from './pages/NewReview';
import VendorDashboard from './pages/VendorDashboard';
import VendorProducts from './pages/VendorProducts';
import NewProduct from './pages/NewProduct';
import EditProduct from './pages/EditProduct';
import VendorOrders from './pages/VendorOrders';
import VendorAbonnement from './pages/VendorAbonnement';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminLogin from './pages/admin/AdminLogin';
import AdminAbonnements from './pages/admin/AdminAbonnements';

const ProtectedRoute = ({ children, roleRequired, bypassBlock = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/connexion" />;
  }

  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/" />;
  }

  // Intercepter les vendeurs bloqués, sauf s'ils sont déjà sur la page d'abonnement (bypassBlock = true)
  if (user?.role === 'vendeur' && user?.compte_bloque && !bypassBlock) {
    return <Navigate to="/vendeur/abonnement" />;
  }

  return children;
};

import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/produit/:pid" element={<ProductDetail />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          
          {/* Protected Client Routes */}
          <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/panier" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/commande/nouvelle" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/mes-commandes" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/commande/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/avis/nouveau/:pid" element={<ProtectedRoute><NewReview /></ProtectedRoute>} />

          {/* Protected Vendor Routes */}
          <Route path="/vendeur/dashboard" element={<ProtectedRoute roleRequired="vendeur"><VendorDashboard /></ProtectedRoute>} />
          <Route path="/vendeur/abonnement" element={<ProtectedRoute roleRequired="vendeur" bypassBlock={true}><VendorAbonnement /></ProtectedRoute>} />
          <Route path="/vendeur/produits" element={<ProtectedRoute roleRequired="vendeur"><VendorProducts /></ProtectedRoute>} />
          <Route path="/vendeur/produits/nouveau" element={<ProtectedRoute roleRequired="vendeur"><NewProduct /></ProtectedRoute>} />
          <Route path="/vendeur/produits/:pid/edit" element={<ProtectedRoute roleRequired="vendeur"><EditProduct /></ProtectedRoute>} />
          <Route path="/vendeur/commandes" element={<ProtectedRoute roleRequired="vendeur"><VendorOrders /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute roleRequired="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/utilisateurs" element={<ProtectedRoute roleRequired="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/produits" element={<ProtectedRoute roleRequired="admin"><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/commandes" element={<ProtectedRoute roleRequired="admin"><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/abonnements" element={<ProtectedRoute roleRequired="admin"><AdminAbonnements /></ProtectedRoute>} />
        </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default App;

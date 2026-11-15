import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantOwnerDashboard from './pages/RestaurantOwnerDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import RestaurantMenu from './pages/RestaurantMenu';
import CartCheckout from './pages/CartCheckout';
import AIInsights from './pages/AIInsights';

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/customer" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/restaurant/:id" element={<ProtectedRoute role="customer"><RestaurantMenu /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute role="customer"><CartCheckout /></ProtectedRoute>} />
        <Route path="/ai-insights" element={<ProtectedRoute role="customer"><AIInsights /></ProtectedRoute>} />

        <Route path="/owner" element={<ProtectedRoute role="restaurant_owner"><RestaurantOwnerDashboard /></ProtectedRoute>} />
        <Route path="/delivery" element={<ProtectedRoute role="delivery_partner"><DeliveryDashboard /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import pages/components

import Register from "./pages/Register/Register";
import BuyerDashboard from "./pages/Dashboard/BuyerDashboard";
import SellerDashboard from "./pages/Dashboard/SellerDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import Login from "./pages/Login/Login";
// import NotFound from "./pages/NotFound";
import { LandingPage } from "./pages/LandingPage/Landing.jsx"
import PlaceBidPage from "./pages/PlaceBidPage/PlaceBidPage.jsx";
import UsersPage from "./pages/UsersPage/UsersPage.jsx";
import PendingItemsPage from "./pages/PendingItemsPage/PendingItemsPage.jsx";
import AuctionsPage from "./pages/Auctions/AuctionsPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Chat from "./pages/Chat/Chat.jsx";
// import FaydaLanding from "./pages/FaydaLanding/FaydaLanding.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/chatbot" element={<Chat />} />

        {/* Protected Routes */}
        <Route path="/buyer" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
        <Route path="/buyer/bid/:auctionId" element={<ProtectedRoute><PlaceBidPage /></ProtectedRoute>} />
        <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/admin/pending-items" element={<ProtectedRoute><PendingItemsPage /></ProtectedRoute>} />
        <Route path="/admin/auctions" element={<ProtectedRoute><AuctionsPage /></ProtectedRoute>} />
        <Route path="/place-bid/:auctionId" element={<ProtectedRoute><PlaceBidPage /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
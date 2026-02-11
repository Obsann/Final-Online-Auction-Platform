import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Package, Gavel, LogOut } from "lucide-react";
import api from "../../utils/api";
import "./Admin.css";

function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [pendingItemsCount, setPendingItemsCount] = useState(0);
  const [auctionsCount, setAuctionsCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get("/api/users");
        setUsersCount(usersRes.data.length);

        const itemsRes = await api.get("/api/items?status=pending");
        setPendingItemsCount(itemsRes.data.length);

        const auctionsRes = await api.get("/api/auctions");
        setAuctionsCount(auctionsRes.data.length);

      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="cards-container">
        <div className="card clickable" onClick={() => navigate("/admin/users")}>
          <Users size={20} />
          <h2>{usersCount} Users</h2>
          <p>Manage all registered users</p>
        </div>

        <div className="card clickable" onClick={() => navigate("/admin/pending-items")}>
          <Package size={20} />
          <h2>{pendingItemsCount} Pending Items</h2>
          <p>Approve or reject items</p>
        </div>

        <div className="card clickable" onClick={() => navigate("/admin/auctions")}>
          <Gavel size={20} />
          <h2>{auctionsCount} Auctions</h2>
          <p>Monitor all auctions</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

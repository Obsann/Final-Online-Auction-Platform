import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../../utils/api";
import { LogOut } from "lucide-react";
import './Buyer.css'

export default function BuyerDashboard() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getTimeLeft = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "Auction hasn't started";
    if (now > end) return "Auction ended";

    const diff = end - now;
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    return `${days}d ${hours}h ${minutes}m`;
  };

  useEffect(() => {
    // api.jsx handles token interceptors automatically
    api.get("/api/auctions")
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error fetching items:", err));
  }, []);

  const handlePlaceBid = (auction) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      localStorage.setItem("pendingBidItem", JSON.stringify(auction));
      navigate("/login");
      return;
    }
    navigate(`/buyer/bid/${auction._id}`);
  };

  const handleViewDetails = (auction) => navigate(`/buyer/bid/${auction._id}`);

  return (
    <div className="buyer-dashboard">
      <div className="dashboard-header">
        <h1>Auctions</h1>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {items.length === 0 && <p>No approved items for auction yet.</p>}

      <div className="auction-items">
        {items.map((auction) => (
          <div key={auction._id} className="auction-item-card">
            <h2>{auction.itemId?.title || "No title"}</h2>
            <p>Category: {auction.itemId?.category || "N/A"}</p>

            {/* Show image if exists */}
            {auction.itemId?.image && (
              <img
                src={`${API_BASE_URL}/uploads/${auction.itemId.image}`}
                alt={auction.itemId.title}
                style={{ maxWidth: "200px", margin: "10px 0" }}
              />
            )}

            <p>
              Starting Price: ${auction.itemId?.startingPrice || 0} |
              Reserve Price: ${auction.itemId?.reservePrice || 0}
            </p>
            <p className="short-description">
              {auction.itemId?.description?.length > 100
                ? auction.itemId.description.substring(0, 100) + "..."
                : auction.itemId?.description || "No description available."}
            </p>
            <p className="time-left">
              Time Left: {getTimeLeft(auction.startTime, auction.endTime)}
            </p>

            <div className="auction-actions">
              <button onClick={() => handleViewDetails(auction)}>View Details</button>
              <button onClick={() => handlePlaceBid(auction)}>Place Bid</button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
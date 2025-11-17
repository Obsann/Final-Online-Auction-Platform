import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Users, Gavel, Star } from "lucide-react";
import Chat from "../Chat/Chat"; // Import your chatbot
import "./Landing.css";

export function LandingPage() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-brand">
            <Gavel className="nav-logo" />
            <span className="brand-text">Online Auction Platform</span>
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About Us</a>
            <a href="#terms" className="nav-link">Terms & Conditions</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
          <div className="nav-actions">
            <button className="nav-button secondary" onClick={() => navigate("/fayda")}>
              Login
            </button>
            <button className="nav-button primary" onClick={() => navigate("/fayda")}>
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Extraordinary <span className="hero-highlight">Treasures</span>
            </h1>
            <p className="hero-description">
              Join the world's most prestigious auction house where collectors
              and connoisseurs discover rare artifacts, luxury items, and
              investment-grade collectibles.
            </p>

            {/* Removed Search Section */}

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Active Bidders</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15K+</span>
                <span className="stat-label">Items Sold</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$2.8B</span>
                <span className="stat-label">Total Sales</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section" id="about">
        <div className="features-container">
          <h2 className="section-title">Why Choose Prestige Auctions</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><Star /></div>
              <h3 className="feature-title">Authenticated Items</h3>
              <p className="feature-description">
                Every item is thoroughly vetted and authenticated by our experts
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Users /></div>
              <h3 className="feature-title">Global Community</h3>
              <p className="feature-description">
                Connect with collectors and enthusiasts from around the world
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Gavel /></div>
              <h3 className="feature-title">Fair Bidding</h3>
              <p className="feature-description">
                Transparent and secure bidding process with real-time updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions Section */}
      <section className="terms-section" id="terms">
        <div className="terms-container">
          <h2 className="section-title">Terms & Conditions</h2>
          <p>
            By participating in auctions on Prestige Auctions, you agree to the
            following terms and conditions. Please read them carefully before
            registering or placing a bid.
          </p>
          <ul className="terms-list">
            <li><strong>Eligibility:</strong> All bidders must be at least 18 years of age and legally capable of entering into contracts.</li>
            <li><strong>Registration:</strong> Users must create an account and provide accurate details to participate in auctions.</li>
            <li><strong>Bidding:</strong> All bids are binding. Once placed, a bid cannot be withdrawn.</li>
            <li><strong>Payments:</strong> Winning bidders must complete payment within the specified time frame. Failure to do so may result in account suspension.</li>
            <li><strong>Item Authenticity:</strong> While Prestige Auctions ensures all items are authenticated, we are not responsible for manufacturer warranties.</li>
            <li><strong>Returns:</strong> All sales are final unless otherwise stated. No refunds will be issued for buyer’s remorse.</li>
            <li><strong>Disputes:</strong> Any disputes will be resolved under applicable laws in the governing jurisdiction of Prestige Auctions.</li>
            <li><strong>Privacy:</strong> User data will be protected in compliance with our Privacy Policy and will not be shared without consent.</li>
          </ul>
          <p>
            By continuing to use this platform, you acknowledge that you have read, understood, and agreed to abide by these terms.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <Gavel className="footer-logo" />
              <span className="footer-brand-text">Prestige Auctions</span>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4 className="footer-title">Platform</h4>
                <a href="#" className="footer-link">How it Works</a>
                <a href="#" className="footer-link">Seller Center</a>
                <a href="#" className="footer-link">Buyer Guide</a>
              </div>
              <div className="footer-section">
                <h4 className="footer-title">Support</h4>
                <a href="#" className="footer-link">Help Center</a>
                <a href="#" className="footer-link">Contact Us</a>
                <a href="#" className="footer-link">Safety & Security</a>
              </div>
              <div className="footer-section">
                <h4 className="footer-title">Legal</h4>
                <a href="#" className="footer-link">Terms of Service</a>
                <a href="#" className="footer-link">Privacy Policy</a>
                <a href="#" className="footer-link">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Prestige Auctions. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Question Mark Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center 
                   rounded-full bg-blue-500 text-white text-xl shadow-lg hover:bg-blue-600"
      >
        ?
      </button>

      {/* Chat Popup */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-96 shadow-xl rounded-xl bg-white border">
          <Chat />
        </div>
      )}
    </div>
  );
}

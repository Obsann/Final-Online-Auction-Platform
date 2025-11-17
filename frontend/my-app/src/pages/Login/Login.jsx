import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../utils/api"; 
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [faydaNumber, setFaydaNumber] = useState(""); // Fayda login state
  const [isFaydaLogin, setIsFaydaLogin] = useState(false); // toggle login method
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      const pendingBid = localStorage.getItem("pendingBidItem");
      if (pendingBid && data.role === "bidder") {
        navigate(`/buyer/bid/${JSON.parse(pendingBid)._id}`);
        localStorage.removeItem("pendingBidItem");
        return;
      }

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "seller") navigate("/seller");
      else if (data.role === "bidder") navigate("/buyer");
      else throw new Error("Unknown role");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaydaLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!faydaNumber.trim()) {
      setError("Please enter your Fayda number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/fayda-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faydaNumber }),
      });

      if (!response.ok) throw new Error("Invalid Fayda number or login failed");

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      const pendingBid = localStorage.getItem("pendingBidItem");
      if (pendingBid && data.role === "bidder") {
        navigate(`/buyer/bid/${JSON.parse(pendingBid)._id}`);
        localStorage.removeItem("pendingBidItem");
        return;
      }

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "seller") navigate("/seller");
      else if (data.role === "bidder") navigate("/buyer");
      else throw new Error("Unknown role");
    } catch (err) {
      setError(err.message || "Fayda login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-description">Sign in to your account</p>

        {/* Toggle login method */}
        <div className="login-toggle">
          <button
            type="button"
            className={`toggle-button ${!isFaydaLogin ? "active" : ""}`}
            onClick={() => setIsFaydaLogin(false)}
          >
            Email Login
          </button>
          <button
            type="button"
            className={`toggle-button ${isFaydaLogin ? "active" : ""}`}
            onClick={() => setIsFaydaLogin(true)}
          >
            Fayda Login
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!isFaydaLogin ? (
          // Email/password login form
          <form className="login-form" onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        ) : (
          // Fayda login form
          <form className="login-form" onSubmit={handleFaydaLogin}>
            <div className="form-group">
              <label>Fayda Number</label>
              <input
                type="text"
                className="form-input"
                value={faydaNumber}
                onChange={(e) => setFaydaNumber(e.target.value)}
                placeholder="Enter your Fayda number"
                required
              />
            </div>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Continue"}
            </button>
          </form>
        )}

        <div className="register-link">
          <span>Don't have an account? </span>
          <button
            type="button"
            className="register-button"
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

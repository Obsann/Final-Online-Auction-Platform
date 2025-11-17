// src/pages/Register/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../../utils/api";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("seller"); // default seller
  const [bankStatement, setBankStatement] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [storedFaydaNumber, setStoredFaydaNumber] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  // Load Fayda number from session storage if exists
  useEffect(() => {
    const faydaNumber = sessionStorage.getItem("fayda_alias_number");
    if (faydaNumber) setStoredFaydaNumber(faydaNumber);
  }, []);

  // Update password strength whenever password changes
  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    } else {
      setPasswordStrength("");
    }
  }, [password]);

  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = new FormData();
      data.append("username", username);
      data.append("email", email);
      data.append("password", password);
      data.append("phone", phone);
      data.append("role", role);
      if (bankStatement) data.append("bankStatement", bankStatement);
      if (storedFaydaNumber) data.append("faydaNumber", storedFaydaNumber);

      const response = await registerUser(data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Save user info locally
      localStorage.setItem("user", JSON.stringify(response));
      localStorage.setItem("token", response.token);

      const pendingBid = localStorage.getItem("pendingBidItem");
      if (pendingBid && response.role === "bidder") {
        navigate(`/buyer/bid/${JSON.parse(pendingBid)._id}`);
        localStorage.removeItem("pendingBidItem");
        return;
      }

      // Redirect based on role
      if (response.role === "admin") navigate("/admin");
      else if (response.role === "seller") navigate("/seller");
      else if (response.role === "bidder") navigate("/buyer");
      else throw new Error("Unknown role");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-description">Sign up to get started</p>
        </div>

        {storedFaydaNumber && (
          <div className="verified-badge">
            <strong>✓ Verified FAN Number</strong>
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-container">
              <input
                id="password"
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
            {passwordStrength && (
              <div className={`password-strength password-${passwordStrength}`}>
                Password strength: {passwordStrength}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="password-container">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              id="phone"
              type="text"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="seller">Seller</option>
              <option value="bidder">Bidder</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bankStatement" className="form-label">Bank Statement</label>
            <input
              id="bankStatement"
              type="file"
              className="form-input"
              onChange={(e) => setBankStatement(e.target.files[0])}
            />
          </div>

          {/* Terms & Conditions */}
          <div className="terms-container">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="terms-text">
              I agree to the{" "}
              <span onClick={() => window.open("#/terms", "_blank")} className="terms-link">
                Terms and Conditions
              </span>{" "}
              and{" "}
              <span onClick={() => window.open("#/privacy", "_blank")} className="terms-link">
                Privacy Policy
              </span>
            </label>
          </div>

          <button type="submit" className="register-button">
            Sign Up
          </button>

          <div className="register-footer">
            <span>Already have an account? </span>
            <button type="button" className="login-button-link" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

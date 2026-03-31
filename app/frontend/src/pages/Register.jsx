import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "./Login.css";

const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 🔥 FIX: map to backend keys
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      console.log("SENDING PAYLOAD:", payload);

      const res = await registerUser(payload);

      console.log("REGISTER RESPONSE:", res);

      if (res && (res.message || res.success)) {
        alert("Check your email to verify your account");
        navigate("/login");
      } else {
        alert(res.message || "Registration failed");
      }
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      alert(
        err?.response?.data?.message || "Server error"
      );
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">

        {/* LEFT */}
        <div className="left-section">
          <div className="brand-header">
            <img src="/svg/h-cloud.svg" alt="logo" className="logo-icon" />
            <div>
              <h1 className="brand-title">
                <span className="brand-dark">HSN</span>{" "}
                <span className="brand-blue">Cloud</span>
              </h1>
              <p className="brand-subtitle">Secure File Storage</p>
            </div>
          </div>

          <img
            src="/svg/cloud-storage.svg"
            alt="illustration"
            className="illustration-img"
          />

          <h2 className="hero-text">
            Securely store, sync, and share your files everywhere
          </h2>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <div className="login-card">

            <div className="header-area">
              <h2>Create Account</h2>
              <p>Sign up for your HSN Cloud account</p>
            </div>

            <form onSubmit={handleRegister}>

              <div className="input-group">
                <label>First Name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Last Name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="login-btn">
                Create Account
              </button>
            </form>

            <div className="signup-footer">
              Already have an account?{" "}
              <span
                className="signup-btn"
                onClick={() => navigate("/login")}
              >
                Log In
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
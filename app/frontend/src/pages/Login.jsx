import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      if (res.token) {
        login(res.token);
        navigate("/dashboard/root");
      } else {
        alert(res.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">

        {/* LEFT SECTION */}
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

        {/* RIGHT SECTION */}
        <div className="right-section">
          <div className="login-card">

            <div className="header-area">
              <h2>Welcome Back</h2>
              <p>Login to your HSN Cloud account</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <span
                    className="toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>

                <span
                  className="forgot-link"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </span>
              </div>

              <button type="submit" className="login-btn">
                Log In
              </button>
            </form>

            <div className="signup-footer">
              Don’t have an account?{" "}
              <span
                className="signup-btn"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
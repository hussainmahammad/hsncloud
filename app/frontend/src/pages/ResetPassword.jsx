import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Login.css"; // reuse same UI

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password) {
      alert("Enter new password");
      return;
    }

    try {
      const res = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await res.json();

      alert(data.message);

      if (res.ok) {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      alert("Error resetting password");
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
              <h2>Reset Password</h2>
              <p>Enter your new password below</p>
            </div>

            <form onSubmit={handleReset}>
              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Reset Password
              </button>
            </form>

            <div className="signup-footer">
              Back to{" "}
              <span
                className="signup-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
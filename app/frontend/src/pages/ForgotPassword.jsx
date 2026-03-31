import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // reuse same UI

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Enter your registered email");
      return;
    }

    try {
      const res = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send reset email");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">

        {/* LEFT SECTION SAME */}
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
              <h2>Forgot Password</h2>
              <p>
                Enter your registered email and we’ll send you a reset link
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="login-btn">
                  Send Reset Link
                </button>
              </form>
            ) : (
              <div className="signup-footer" style={{ marginTop: "20px" }}>
                ✅ A password reset link has been sent to your email. <br />
                Please check your inbox and follow the instructions.
              </div>
            )}

            <div className="signup-footer">
              Remember your password?{" "}
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

export default ForgotPassword;
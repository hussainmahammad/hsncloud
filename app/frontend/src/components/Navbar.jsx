import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <div
      style={{
        padding: "10px 20px",
        background: "#222",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* 🔥 LEFT SIDE - LOGO */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src="/svg/h-cloud.svg"
          alt="logo"
          style={{ width: "35px", height: "35px" }}
        />

        <h2 style={{ margin: 0 }}>
          <span style={{ color: "#fff" }}>HSN</span>{" "}
          <span style={{ color: "#3b82f6" }}>Cloud</span>
        </h2>
      </div>

      {/* 🔥 RIGHT SIDE - LOGOUT */}
      <button
        onClick={logout}
        style={{
          background: "#ef4444",
          border: "none",
          padding: "6px 12px",
          color: "#fff",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
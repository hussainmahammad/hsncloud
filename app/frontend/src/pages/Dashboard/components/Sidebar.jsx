const Sidebar = ({
  view,
  setView,
  setCurrentPath,
  handleCreateFolder,
  setCurrentFolderId, // ✅ NEW (IMPORTANT)
}) => {
  const handleDriveClick = () => {
    setView("drive");

    // ✅ reset to root properly (Google Drive style)
    setCurrentPath([{ id: null, name: "My Drive" }]);

    // ✅ reset folder ID
    if (setCurrentFolderId) {
      setCurrentFolderId(null);
    }
  };

  return (
    <div className="sidebar">
      <button className="new-btn" onClick={handleCreateFolder}>
        + New
      </button>

      <div className="menu">
        <div
          className={`menu-item ${view === "drive" ? "active" : ""}`}
          onClick={handleDriveClick}
        >
          My Drive
        </div>

        <div
          className={`menu-item ${view === "recent" ? "active" : ""}`}
          onClick={() => setView("recent")}
        >
          Recent
        </div>

        <div
          className={`menu-item ${view === "trash" ? "active" : ""}`}
          onClick={() => setView("trash")}
        >
          Trash
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
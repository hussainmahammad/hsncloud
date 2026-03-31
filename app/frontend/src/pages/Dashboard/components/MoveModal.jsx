import { useState, useEffect } from "react";
import { getFoldersAPI } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const MoveModal = ({
  moveItem,
  setMoveItem,
  onMove,
}) => {
  const { token } = useAuth();

  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [path, setPath] = useState([{ id: null, name: "My Drive" }]);

  // ===== FETCH FOLDERS =====
  const fetchFolders = async (folderId = null) => {
    try {
      const res = await getFoldersAPI(token, folderId);
      setFolders(res || []);
    } catch (err) {
      console.error("Fetch folders error:", err);
      setFolders([]);
    }
  };

  useEffect(() => {
    if (moveItem) {
      fetchFolders(currentFolderId);
    }
  }, [moveItem, currentFolderId]);

  if (!moveItem) return null;

  // ===== NAVIGATION =====
  const openFolder = (folder) => {
    setCurrentFolderId(folder.id);
    setPath((prev) => [
      ...prev,
      { id: folder.id, name: folder.folder_name },
    ]);
  };

  const goBack = (index) => {
    const newPath = path.slice(0, index + 1);
    setPath(newPath);

    const target = newPath[newPath.length - 1];
    setCurrentFolderId(target.id);
  };

  const handleMove = () => {
    if (!onMove) return;

    onMove(moveItem, currentFolderId);
    setMoveItem(null);

    // reset
    setCurrentFolderId(null);
    setPath([{ id: null, name: "My Drive" }]);
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>Select Destination Folder</h3>

        {/* ===== BREADCRUMB ===== */}
        <div style={{ marginBottom: "10px" }}>
          {path.map((p, i) => (
            <span
              key={i}
              onClick={() => goBack(i)}
              style={{ cursor: "pointer" }}
            >
              {p.name}
              {i < path.length - 1 && " > "}
            </span>
          ))}
        </div>

        {/* ===== FOLDER LIST ===== */}
        <div style={{ marginTop: "10px", maxHeight: "200px", overflowY: "auto" }}>
          {folders.length === 0 && (
            <div className="empty">No folders available</div>
          )}

          {folders.map((folder) => (
            <div
              key={folder.id}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => openFolder(folder)}
            >
              📁 {folder.folder_name}
            </div>
          ))}
        </div>

        {/* ===== ACTIONS ===== */}
        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button onClick={handleMove}>Move Here</button>
          <button onClick={() => setMoveItem(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MoveModal;
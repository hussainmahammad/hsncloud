import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "./Dashboard.css";
import { moveFile, moveFolder } from "../../services/api";

import {
  getFiles,
  getTrashFiles,
  getTrashFolders,
  uploadFile,
  createFolderAPI,
  getFoldersAPI,
  deleteFile,
  deleteFolder,
  restoreFile,
  restoreFolder,
  permanentDeleteFile,
  permanentDeleteFolder,
  emptyTrashFiles,
  emptyTrashFolders,
} from "../../services/api";

import { useAuth } from "../../context/AuthContext";

import {
  previewFile as handlePreviewFile,
  downloadFileHandler,
} from "./features/files";
import { uploadFiles } from "./features/upload";
import {
  deleteItemHandler,
  restoreItemHandler,
  permanentDeleteHandler,
} from "./features/delete";
import { getRecentFiles } from "./features/recent";
import { showMessage } from "./features/messages";

// components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FileTable from "./components/FileTable";
import MoveModal from "./components/MoveModal";
import PreviewModal from "./components/PreviewModal";

const Dashboard = () => {
  const { token } = useAuth();

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [recent, setRecent] = useState([]);

  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [currentPath, setCurrentPath] = useState([
    { id: null, name: "My Drive" },
  ]);

  const [previewFile, setPreviewFile] = useState(null);
  const [moveItem, setMoveItem] = useState(null);

  const [search, setSearch] = useState("");
  const [view, setView] = useState("drive");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== FETCH =====
  const fetchFiles = async () => {
    try {
      setLoading(true);

      let res;

      if (view === "trash") {
        res = await getTrashFiles(token);
      } else {
        res = await getFiles(token, currentFolderId);
      }

      const formatted = (res?.files || res || []).map((f) => ({
        ...f,
        name: f.file_name,
        type: f.file_type,
        // ❌ REMOVED url & download_url dependency
      }));

      setFiles(formatted);
      setRecent(getRecentFiles(formatted));
    } catch (err) {
      console.error("Fetch files error:", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      let res;

      if (view === "trash") {
        res = await getTrashFolders(token);
      } else {
        res = await getFoldersAPI(token, currentFolderId);
      }

      setFolders(res || []);
    } catch (err) {
      console.error("Fetch folders error:", err);
      setFolders([]);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, [currentFolderId, view]);

  // ===== EMPTY TRASH =====
  const handleEmptyTrash = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete all items in Trash?"
    );

    if (!confirmDelete) return;

    try {
      await emptyTrashFiles(token);
      await emptyTrashFolders(token);

      await fetchFiles();
      await fetchFolders();

      showMessage(setMsg, "Trash emptied successfully 🗑️");
    } catch (err) {
      console.error(err);
      showMessage(setMsg, "Failed to empty trash ❌");
    }
  };

  // ===== ACTIONS =====

  const handleCreateFolder = async () => {
    const name = prompt("Enter folder name");
    if (!name) return;

    await createFolderAPI(name, token, currentFolderId);
    fetchFolders();

    showMessage(setMsg, "Folder created ✅");
  };

  const handleUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    await uploadFiles({
      files: selectedFiles,
      token,
      currentFolderId,
      uploadFile,
      fetchFiles,
      showMessage: (text) => showMessage(setMsg, text),
    });

    e.target.value = null;
  };

  const deleteItem = async (item) => {
    const isFile = item.file_name || item.name;

    await deleteItemHandler({
      item,
      type: isFile ? "file" : "folder",
      token,
      deleteFile,
      deleteFolder,
      fetchFiles,
      fetchFolders,
      showMessage: (text) => showMessage(setMsg, text),
    });
  };

  const restoreItem = async (item) => {
    await restoreItemHandler({
      item,
      type: item.file_name || item.name ? "file" : "folder",
      token,
      restoreFile,
      restoreFolder,
      fetchFiles,
      fetchFolders,
      showMessage: (text) => showMessage(setMsg, text),
    });
  };

  const permanentDeleteItem = async (item) => {
    await permanentDeleteHandler({
      item,
      type: item.file_name || item.name ? "file" : "folder",
      token,
      permanentDeleteFile,
      permanentDeleteFolder,
      fetchFiles,
      fetchFolders,
      showMessage: (text) => showMessage(setMsg, text),
    });
  };

  // ===== FILE HANDLING =====

  const preview = (file) => {
    if (!file?.id) {
      showMessage(setMsg, "Preview not available ❌");
      return;
    }

    handlePreviewFile(file);
  };

  const downloadFile = (file) => {
    if (!file?.id) {
      showMessage(setMsg, "Download failed ❌");
      return;
    }

    downloadFileHandler(file);
  };

  // ===== MOVE =====
  const handleMove = async (item, targetFolderId) => {
    try {
      if (item.file_name || item.name) {
        await moveFile(item.id, targetFolderId, token);
      } else {
        await moveFolder(item.id, targetFolderId, token);
      }

      await fetchFiles();
      await fetchFolders();

      showMessage(setMsg, "Moved successfully ✅");
    } catch (err) {
      console.error("Move error:", err);
      showMessage(setMsg, "Move failed ❌");
    }
  };

  // ===== NAVIGATION =====

  const openFolder = (folder) => {
    setCurrentFolderId(folder.id);

    setCurrentPath((prev) => [
      ...prev,
      { id: folder.id, name: folder.folder_name },
    ]);
  };

  const goBack = (index) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);

    const target = newPath[newPath.length - 1];
    setCurrentFolderId(target.id);
  };

  // ===== SEARCH =====

  const filteredFiles = files.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFolders = folders.filter((f) =>
    f.folder_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="drive">
      <Navbar />

      <div className="drive-body">
        <Sidebar
          view={view}
          setView={setView}
          setCurrentPath={setCurrentPath}
          setCurrentFolderId={setCurrentFolderId}
          handleCreateFolder={handleCreateFolder}
        />

        <div className="main">
          <Topbar
            search={search}
            setSearch={setSearch}
            handleUpload={handleUpload}
          />

          {msg && <div className="empty">{msg}</div>}
          {loading && <div className="empty">Loading...</div>}

          <div className="breadcrumb" style={{ marginBottom: "15px" }}>
            {currentPath.map((p, i) => (
              <span key={i} onClick={() => goBack(i)}>
                {p.name}
                {i < currentPath.length - 1 && " > "}
              </span>
            ))}
          </div>

          {!loading && view === "drive" && (
            <FileTable
              folders={filteredFolders}
              files={filteredFiles}
              preview={preview}
              deleteItem={deleteItem}
              downloadFile={downloadFile}
              openFolder={openFolder}
              setMoveItem={setMoveItem}
            />
          )}

          {!loading && view === "recent" && (
            <FileTable
              folders={[]}
              files={recent}
              preview={preview}
              deleteItem={deleteItem}
              downloadFile={downloadFile}
              openFolder={() => {}}
              setMoveItem={setMoveItem}
            />
          )}

          {!loading && view === "trash" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <button
                  onClick={handleEmptyTrash}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Empty Trash
                </button>
              </div>

              <FileTable
                folders={filteredFolders}
                files={filteredFiles}
                preview={preview}
                deleteItem={deleteItem}
                downloadFile={downloadFile}
                openFolder={() => {}}
                setMoveItem={setMoveItem}
                restoreItem={restoreItem}
                permanentDeleteItem={permanentDeleteItem}
                isTrash={true}
              />
            </>
          )}
        </div>
      </div>

      <MoveModal
        moveItem={moveItem}
        setMoveItem={setMoveItem}
        folders={folders}
        onMove={handleMove}
      />

      <PreviewModal
        previewFile={previewFile}
        setPreviewFile={setPreviewFile}
      />
    </div>
  );
};

export default Dashboard;
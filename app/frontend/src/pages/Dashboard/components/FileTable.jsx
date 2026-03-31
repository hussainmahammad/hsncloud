import { useState, useEffect } from "react";

// ================= IMAGE PREVIEW FIX =================
const ImagePreview = ({ file }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let objectUrl;

    const load = async () => {
      try {
        const res = await fetch(`/api/files/${file.id}/view`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Image fetch failed");

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      } catch (err) {
        console.error("Image preview error:", err);
      }
    };

    load();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!src) {
    return <span style={{ fontSize: "20px" }}>🖼</span>;
  }

  return (
    <img
      src={src}
      alt="preview"
      style={{
        width: "35px",
        height: "35px",
        objectFit: "cover",
        borderRadius: "6px",
      }}
    />
  );
};

// ================= ICONS =================
const getFileIcon = (file) => {
  const type = (file?.type || file?.file_type || "").toLowerCase();

  if (type.includes("pdf")) return "📄";
  if (type.startsWith("video")) return "🎬";
  if (type.startsWith("audio")) return "🎵";

  return "📦";
};

const isImage = (file) => {
  const type = (file?.type || "").toLowerCase();
  return type.startsWith("image");
};

// ================= MAIN =================
const FileTable = ({
  folders = [],
  files = [],
  preview,
  deleteItem,
  downloadFile,
  openFolder,
  setMoveItem,
  restoreItem,
  permanentDeleteItem,
  isTrash = false,
}) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (file) => {
    if (!deleteItem) return;

    try {
      setDeletingId(file.id);
      await deleteItem(file);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestore = async (item) => {
    if (!restoreItem) return;
    await restoreItem(item);
  };

  const handlePermanentDelete = async (item) => {
    if (!permanentDeleteItem) return;
    await permanentDeleteItem(item);
  };

  const handlePreview = (file) => {
    preview && preview(file);
  };

  const handleDownload = (file) => {
    downloadFile && downloadFile(file);
  };

  return (
    <div className="table">
      <div className="table-head">
        <span>Name</span>
        <span>Type</span>
        <span>Actions</span>
      </div>

      {/* ===== FOLDERS ===== */}
      {folders.map((folder) => (
        <div key={folder?.id} className="row">
          <div
            className="name"
            onClick={() => !isTrash && openFolder && openFolder(folder)}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <span style={{ fontSize: "20px" }}>📁</span>
            {folder?.folder_name || "Unnamed Folder"}
          </div>

          <div>Folder</div>

          <div className="actions">
            {!isTrash && (
              <>
                <button onClick={() => openFolder && openFolder(folder)}>
                  Open
                </button>

                <button onClick={() => setMoveItem && setMoveItem(folder)}>
                  Move
                </button>

                <button onClick={() => handleDelete(folder)}>
                  Delete
                </button>
              </>
            )}

            {isTrash && (
              <>
                <button onClick={() => handleRestore(folder)}>
                  Restore
                </button>

                <button onClick={() => handlePermanentDelete(folder)}>
                  Delete Permanently
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* ===== FILES ===== */}
      {files.map((file, i) => {
        const fileName = file?.name || file?.file_name || "Unnamed File";
        const fileType = file?.type || file?.file_type || "Unknown";
        const isDeleting = deletingId === file?.id;

        return (
          <div key={file?.id || i} className="row">
            <div
              className="name"
              onClick={() => !isTrash && handlePreview(file)}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              {isImage(file) ? (
                <ImagePreview file={file} />
              ) : (
                <span style={{ fontSize: "20px" }}>
                  {getFileIcon(file)}
                </span>
              )}

              {fileName}
            </div>

            <div>{fileType}</div>

            <div className="actions">
              {!isTrash && (
                <>
                  <button
                    onClick={() => handlePreview(file)}
                    disabled={isDeleting}
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDownload(file)}
                    disabled={isDeleting}
                  >
                    Download
                  </button>

                  <button
                    onClick={() => setMoveItem && setMoveItem(file)}
                    disabled={isDeleting}
                  >
                    Move
                  </button>

                  <button
                    onClick={() => handleDelete(file)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}

              {isTrash && (
                <>
                  <button onClick={() => handleRestore(file)}>
                    Restore
                  </button>

                  <button onClick={() => handlePermanentDelete(file)}>
                    Delete Permanently
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* ===== EMPTY ===== */}
      {folders.length === 0 && files.length === 0 && (
        <div className="empty">Empty Folder</div>
      )}
    </div>
  );
};

export default FileTable;
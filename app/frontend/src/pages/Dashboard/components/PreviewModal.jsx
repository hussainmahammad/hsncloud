const PreviewModal = ({ previewFile, setPreviewFile }) => {
  if (!previewFile) return null;

  const { file, url } = previewFile;

  // ✅ SAFE TYPE HANDLING
  const type = file?.type || file?.file_type || "";

  const isImage = type.startsWith("image");
  const isVideo = type.startsWith("video");
  const isAudio = type.startsWith("audio");
  const isPDF = type.includes("pdf");

  return (
    <div className="modal">
      <div className="preview">
        {/* CLOSE */}
        <button onClick={() => setPreviewFile(null)}>Close</button>

        {/* FILE NAME */}
        <h4 style={{ marginBottom: "10px" }}>
          {file?.name || file?.file_name || "Preview"}
        </h4>

        {/* ===== PREVIEW TYPES ===== */}
        {isImage && <img src={url} alt="preview" />}

        {isVideo && <video controls src={url} />}

        {isAudio && <audio controls src={url} />}

        {isPDF && <iframe src={url} title="pdf-preview" />}

        {/* ===== FALLBACK ===== */}
        {!isImage && !isVideo && !isAudio && !isPDF && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Preview not supported for this file</p>

            <button
              onClick={() => window.open(url, "_blank")}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Open File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
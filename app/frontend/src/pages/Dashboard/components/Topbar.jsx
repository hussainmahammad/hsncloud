import { useState } from "react";

const Topbar = ({ search, setSearch, handleUpload }) => {
  const [uploading, setUploading] = useState(false);

  const onUploadChange = async (e) => {
    if (!handleUpload) return;

    try {
      setUploading(true);
      await handleUpload(e);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="topbar">
      {/* SEARCH */}
      <input
        placeholder="Search files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* UPLOAD */}
      <label
        className="upload"
        style={{
          opacity: uploading ? 0.6 : 1,
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload"}

        <input
          type="file"
          multiple
          hidden
          onChange={onUploadChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
};

export default Topbar;
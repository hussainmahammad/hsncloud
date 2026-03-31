// ================= PREVIEW =================
export const previewFile = async (file) => {
  if (!file?.id) {
    alert("❌ File ID missing");
    return;
  }

  try {
    const res = await fetch(`/api/files/${file.id}/view`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Preview failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  } catch (err) {
    console.error("Preview error:", err);
    alert("❌ Unable to preview file");
  }
};

// ================= DOWNLOAD =================
export const downloadFileHandler = async (file) => {
  if (!file?.id) {
    alert("❌ File ID missing");
    return;
  }

  try {
    const res = await fetch(`/api/files/${file.id}/download`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Download failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name || file.file_name || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("Download error:", err);
    alert("❌ Unable to download file");
  }
};
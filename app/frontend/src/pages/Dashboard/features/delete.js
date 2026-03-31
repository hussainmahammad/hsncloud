// ================= SOFT DELETE =================
// Works for BOTH file & folder
export const deleteItemHandler = async ({
  item,
  type, // "file" | "folder"
  token,
  deleteFile,
  deleteFolder,
  fetchFiles,
  fetchFolders,
  showMessage,
}) => {
  try {
    if (type === "file") {
      await deleteFile(item.id, token); // moves to trash
    } else if (type === "folder") {
      await deleteFolder(item.id, token); // moves to trash
    }

    // refresh UI
    if (fetchFiles) await fetchFiles();
    if (fetchFolders) await fetchFolders();

    showMessage("Moved to Trash 🗑️");
  } catch (err) {
    console.error(err);
    showMessage("Delete failed ❌");
  }
};

// ================= RESTORE =================
export const restoreItemHandler = async ({
  item,
  type,
  token,
  restoreFile,
  restoreFolder,
  fetchFiles,
  fetchFolders,
  showMessage,
}) => {
  try {
    if (type === "file") {
      await restoreFile(item.id, token);
    } else if (type === "folder") {
      await restoreFolder(item.id, token);
    }

    if (fetchFiles) await fetchFiles();
    if (fetchFolders) await fetchFolders();

    showMessage("Restored successfully ♻️");
  } catch (err) {
    console.error(err);
    showMessage("Restore failed ❌");
  }
};

// ================= PERMANENT DELETE =================
export const permanentDeleteHandler = async ({
  item,
  type,
  token,
  permanentDeleteFile,
  permanentDeleteFolder,
  fetchFiles,
  fetchFolders,
  showMessage,
}) => {
  try {
    if (type === "file") {
      await permanentDeleteFile(item.id, token);
    } else if (type === "folder") {
      await permanentDeleteFolder(item.id, token);
    }

    if (fetchFiles) await fetchFiles();
    if (fetchFolders) await fetchFolders();

    showMessage("Deleted permanently 💀");
  } catch (err) {
    console.error(err);
    showMessage("Permanent delete failed ❌");
  }
};

// ================= BACKWARD COMPATIBILITY (IMPORTANT) =================
// 🔥 Keeps your existing Dashboard working without changes
export const deleteFileHandler = async ({
  file,
  token,
  deleteFile,
  fetchFiles,
  showMessage,
}) => {
  try {
    await deleteFile(file.id, token); // soft delete

    if (fetchFiles) await fetchFiles();

    showMessage("Moved to Trash 🗑️");
  } catch (err) {
    console.error(err);
    showMessage("Delete failed ❌");
  }
};
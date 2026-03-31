export const uploadFiles = async ({
  files,
  token,
  currentFolderId,
  uploadFile,
  fetchFiles,
  showMessage,
}) => {
  try {
    for (let file of files) {
      await uploadFile(file, token, currentFolderId);
    }

    await fetchFiles();
    showMessage("Upload successful ✅");
  } catch (err) {
    console.error(err);
    showMessage("Upload failed ❌");
  }
};
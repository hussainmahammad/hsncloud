export const openFolderHandler = (folder, setCurrentFolderId, setCurrentPath) => {
  setCurrentFolderId(folder.id);
  setCurrentPath((prev) => [...prev, folder.folder_name]);
};

export const goBackHandler = (index, setCurrentPath, setCurrentFolderId) => {
  setCurrentPath((prev) => prev.slice(0, index + 1));

  if (index === 0) {
    setCurrentFolderId(null);
  }
};
// ================= BASE CONFIG =================

// 🔥 CHANGE THIS IF IP CHANGES
const BASE_URL = "/api";

// ================= COMMON REQUEST HANDLER =================

const request = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    let data = {};
try {
  data = await res.json();
} catch {
  data = {};
}

    if (!res.ok) {
      throw {
        message: data.message || "Something went wrong",
        status: res.status,
        data,
      };
    }

    return data;
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};

// ================= AUTH =================

export const loginUser = async (data) => {
  return request(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const registerUser = async (data) => {
  return request(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// ================= FILES =================

export const getFiles = async (token, folderId) => {
  let url = `${BASE_URL}/files`;

  if (folderId) {
    url += `?folder_id=${folderId}`;
  }

  return request(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTrashFiles = async (token) => {
  return request(`${BASE_URL}/files/trash`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadFile = async (file, token, currentFolderId) => {
  const formData = new FormData();
  formData.append("file", file);

  // 🔥 ADD THIS LINE
  if (currentFolderId) {
    formData.append("folder_id", currentFolderId);
  }

  return request(`${BASE_URL}/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const deleteFile = async (id, token) => {
  return request(`${BASE_URL}/files/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const restoreFile = async (id, token) => {
  return request(`${BASE_URL}/files/restore/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const permanentDeleteFile = async (id, token) => {
  return request(`${BASE_URL}/files/permanent/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🔥 NEW: EMPTY TRASH FILES
export const emptyTrashFiles = async (token) => {
  return request(`${BASE_URL}/files/trash/empty`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ================= FOLDERS =================

export const createFolder = async (name, token) => {
  return request(`${BASE_URL}/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
};

export const getFolders = async (token) => {
  return request(`${BASE_URL}/folders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTrashFolders = async (token) => {
  return request(`${BASE_URL}/folders/trash`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFolder = async (id, token) => {
  return request(`${BASE_URL}/folders/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const restoreFolder = async (id, token) => {
  return request(`${BASE_URL}/folders/restore/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const permanentDeleteFolder = async (id, token) => {
  return request(`${BASE_URL}/folders/permanent/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🔥 NEW: EMPTY TRASH FOLDERS
export const emptyTrashFolders = async (token) => {
  return request(`${BASE_URL}/folders/trash/empty`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ================= MOVE =================

export const moveFile = async (id, targetFolderId, token) => {
  return request(`${BASE_URL}/move/file/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      folderId: targetFolderId,
    }),
  });
};

export const moveFolder = async (id, targetFolderId, token) => {
  return request(`${BASE_URL}/move/folder/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      folderId: targetFolderId,
    }),
  });
};

// ================= FOLDER APIs (ADVANCED) =================

export const createFolderAPI = async (name, token, parentId) => {
  const res = await fetch(`${BASE_URL}/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      folder_name: name,
      parent_id: parentId || null,
    }),
  });

  return res.json();
};

export const getFoldersAPI = async (token, parentId) => {
  let url = `${BASE_URL}/folders`;

  if (parentId) {
    url += `?parent_id=${parentId}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
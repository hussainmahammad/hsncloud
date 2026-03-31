import { useState } from "react";

const UploadModal = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadModal;
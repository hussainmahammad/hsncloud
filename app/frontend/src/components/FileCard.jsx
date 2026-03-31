const FileCard = ({ file, onDelete, onDownload }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        margin: "10px",
        width: "150px",
        borderRadius: "8px",
      }}
    >
      <p>{file.name}</p>

      <button onClick={() => onDownload(file.id)}>⬇️</button>
      <button onClick={() => onDelete(file.id)}>❌</button>
    </div>
  );
};

export default FileCard;
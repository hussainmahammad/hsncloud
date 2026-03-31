import { useParams } from "react-router-dom";

const Share = () => {
  const { token } = useParams();

  const handleDownload = () => {
    window.open(`http://localhost:5000/public/${token}`);
  };

  return (
    <div>
      <h2>Shared File</h2>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default Share;
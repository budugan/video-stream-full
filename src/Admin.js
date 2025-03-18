import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './index.css';

const Admin = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const { tag } = useParams();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a video file to upload.");
      return;
    }

    const extension = selectedFile.name.split('.').pop();
    const newFilename = tag + "." + extension;

    const renamedFile = new File([selectedFile], newFilename, { type: selectedFile.type });

    const formData = new FormData();
    formData.append('video', renamedFile);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log("File uploaded:", result);
      onFileUpload(result.filename);
      // navigate("/preview"); // Navigate to the preview page
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="title">Video cu tag {tag}</h1>
      <input className="file-input" type="file" onChange={handleFileChange} />
      <button className="upload-button" onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Admin;

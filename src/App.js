import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./Admin";
import Preview from "./Preview";

const App = () => {
  const [videoFilename, setVideoFilename] = useState(null);

  const handleFileUpload = (filename) => {
    setVideoFilename(filename);
  };

  return (
    <Router>
      <Routes>
        <Route path="/:tag/admin" element={<Admin onFileUpload={handleFileUpload} />} />
        <Route path="/:tag" element={<Preview videoSource={videoFilename} />} />
      </Routes>
    </Router>
  );
};

export default App;

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 5000;
const uploadDir = path.join(__dirname, 'videos');



app.use(cors());


// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
// Middleware for handling video uploads as streams
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        
        cb(null, file.originalname);    
    }
});
const upload = multer({ storage });
// **Route for streaming upload**
app.post("/upload", (req, res, next) => {

    upload.single("video")(req, res, (err) => {
  
      if (err) {
  
        console.error("Upload error:", err);
  
        return res.status(500).json({ error: "File upload failed" });
  
      }
  
      res.json({ message: "Upload successful", filename: req.file.filename });
  
    });
  
  });
   
// **Route for video streaming with HTTP Range requests**
app.get('/video/:filename', (req, res) => {
    const videoPath = path.join(uploadDir, req.params.filename);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
        return;
    }
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
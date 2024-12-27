const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config()
const { dbConnection } = require('./config/db.config')

const app = express();

const PORT = process.env.PORT;

console.log('port',PORT);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' directory
  }, 
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Save files with a unique name
  },
});
const upload = multer({ storage });
app.use(express.json());


// API Route for uploading an image
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    // Insert the file name into the database
    const fileName = req.file.filename;
    const query = 'INSERT INTO uploads (file_name) VALUES (?)';
  
    dbConnection.query(query, [fileName], (err, result) => {
      if (err) {
        console.error('Failed to insert file name into database:', err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      res.json({
        message: 'File uploaded and stored in database successfully',
        filePath: `/uploads/${fileName}`,
        dbId: result.insertId, // Return the inserted ID
      });
    });
  });
  
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
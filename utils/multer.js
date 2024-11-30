import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads folder exists (if not, create it)
import fs from "fs";
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to the uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Give each file a unique name
  },
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg", 
    "image/png", 
    "video/mp4", 
    "application/pdf"
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type")); // Reject the file
  }
};

// Multer setup with storage and file filter
const upload = multer({
  storage,
  fileFilter,
});

export default upload;

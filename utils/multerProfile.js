import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage for profilePic and signature
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Restrict file types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPEG and PNG images are allowed"));
  }
};

// Multer instance for profilePic and signature
const uploadProfile = multer({
  storage,
  fileFilter,
}).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "signature", maxCount: 1 },
]);

export default uploadProfile;

import multer from 'multer';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import Playlist from '../models/playlistModel.js';
import Course from '../models/courseModel.js';

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([{ name: 'thumbnail', maxCount: 1 }]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream({ folder }, (error, result) => {
      if (error) reject(error);
      else resolve(result.secure_url);
    }).end(file.buffer);
  });
};

export const createPlaylist = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'Error in file upload' });

    try {
      const { title, description, instructor, courses } = req.body;
      const playlistData = { title, description, instructor, courses: JSON.parse(courses) };

      if (req.files.thumbnail && req.files.thumbnail[0]) {
        playlistData.thumbnail = await uploadToCloudinary(req.files.thumbnail[0], 'playlists/thumbnails');
      }

      const playlist = new Playlist(playlistData);
      await playlist.save();
      res.status(201).json({ message: 'Playlist created successfully', playlist });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

export const updatePlaylist = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'Error in file upload' });

    try {
      const { id } = req.params;
      const { title, description, courses } = req.body;
      const playlistData = { title, description, courses: JSON.parse(courses) };

      if (req.files.thumbnail && req.files.thumbnail[0]) {
        playlistData.thumbnail = await uploadToCloudinary(req.files.thumbnail[0], 'playlists/thumbnails');
      }

      const playlist = await Playlist.findByIdAndUpdate(id, playlistData, { new: true });
      res.status(200).json({ message: 'Playlist updated successfully', playlist });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
});
};

export const getPlaylist = async (req, res) => {
  console.log('route is hitting')
try {
  const { id } = req.params;
  const playlist = await Playlist.findById(id).populate('instructor').populate('courses');
  res.status(200).json({ playlist });
} catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Server error' });
}
};

export const getAllPlaylists = async (req, res) => {
  console.log('route is hitting')
try {
  const playlists = await Playlist.find().populate('instructor').populate('courses');
  res.status(200).json({ playlists });
} catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Server error' });
}
};

export const deletePlaylist = async (req, res) => {
try {
  const { id } = req.params;
  await Playlist.findByIdAndDelete(id);
  res.status(200).json({ message: 'Playlist deleted successfully' });
} catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Server error' });
}
};

export const addCourseToPlaylist = async (req, res) => {
try {
  const { playlistId, courseId } = req.body;
  const playlist = await Playlist.findById(playlistId);
  playlist.courses.push(courseId);
  await playlist.save();
  res.status(200).json({ message: 'Course added to playlist', playlist });
} catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Server error' });
}
};

export const removeCourseFromPlaylist = async (req, res) => {
try {
  const { playlistId, courseId } = req.body;
  const playlist = await Playlist.findById(playlistId);
  playlist.courses.pull(courseId);
  await playlist.save();
  res.status(200).json({ message: 'Course removed from playlist', playlist });
} catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Server error' });
}
};

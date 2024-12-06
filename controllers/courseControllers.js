import multer from 'multer';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import Course from '../models/courseModel.js';

dotenv.config();

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload files to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          reject(new Error('Failed to upload file to Cloudinary'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer); // Pipe the buffer to the upload stream
  });
};

// Create Course
export const createCourse = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'File upload failed' });

    try {
      const { title, description, category, instructor, isPaid, price, discountPrice, duration } = req.body;

      const courseData = { title, description, category, instructor, isPaid, price, discountPrice, duration };
      // Upload and assign URLs for each file type
      if (req.files.thumbnail?.[0]) {
        courseData.thumbnail = await uploadToCloudinary(req.files.thumbnail[0].buffer, 'course_thumbnails', 'image');
      }
      if (req.files.video?.[0]) {
        courseData.videoUrl = await uploadToCloudinary(req.files.video[0].buffer, 'course_videos', 'video');
      }
      if (req.files.pdf?.[0]) {
        // PDF (updated resource_type)
courseData.pdfUrl = await uploadToCloudinary(req.files.pdf[0].buffer, 'courses/pdfs', 'image');
      }

      // Save course to the database
      const course = await Course.create(courseData);
      res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
};






const uploadToCloudinaryForUpdate = async (fileBuffer, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          reject(new Error('Failed to upload file to Cloudinary'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (url, resourceType) => {
  try {
    const publicId = url.split('/').pop().split('.')[0];
    await cloudinary.v2.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
  }
};

export const updateCourse = async (req, res) => {
  console.log('route is hit');
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'File upload failed' });


    console.log('req.body is' , req.body)

    try {
      const { id } = req.params;
      const { title, description, category, isPaid, price, discountPrice, duration } = req.body;

      console.log('description:', description);

      const existingCourse = await Course.findById(id);
      if (!existingCourse) return res.status(404).json({ error: 'Course not found' });

      const courseData = { title, description, category, isPaid, price, discountPrice, duration };

      // Handle thumbnail upload
      if (req.files?.thumbnail?.[0]) {
        if (existingCourse.thumbnail) {
          await deleteFromCloudinary(existingCourse.thumbnail, 'image');
        }
        courseData.thumbnail = await uploadToCloudinaryForUpdate(req.files.thumbnail[0].buffer, 'course_thumbnails', 'image');
      } else {
        courseData.thumbnail = existingCourse.thumbnail;
      }

      // Handle video upload
      if (req.files?.video?.[0]) {
        if (existingCourse.videoUrl) {
          await deleteFromCloudinary(existingCourse.videoUrl, 'video');
        }
        courseData.videoUrl = await uploadToCloudinaryForUpdate(req.files.video[0].buffer, 'course_videos', 'video');
      } else {
        courseData.videoUrl = existingCourse.videoUrl;
      }

      // Handle PDF upload
      if (req.files?.pdf?.[0]) {
        if (existingCourse.pdfUrl) {
          await deleteFromCloudinary(existingCourse.pdfUrl, 'image');
        }
        courseData.pdfUrl = await uploadToCloudinaryForUpdate(req.files.pdf[0].buffer, 'courses/pdfs', 'pdf');
      } else {
        courseData.pdfUrl = existingCourse.pdfUrl;
      }

      // Update the course with the new data
      const updatedCourse = await Course.findByIdAndUpdate(id, courseData, { new: true });

      return res.status(200).json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      return res.status(500).json({ error: 'Failed to update course' });
    }
  });
};




// Get a Course by ID
export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('instructor');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor');
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a Course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

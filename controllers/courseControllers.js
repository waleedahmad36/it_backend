import Course from "../models/courseModel.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import mongoose from "mongoose";

// Function to delete local files after uploading to Cloudinary
const deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting local file:", err);
  });
};

// Upload file to Cloudinary
const uploadToCloudinary = async (filePath, folder, resourceType = "auto") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Invalid file upload");
  } finally {
    // Delete local file after upload
    deleteLocalFile(filePath);
  }
};

export const createCourse = async (req, res) => {
  const { title, description, category, instructor, isPaid, price } = req.body;

  console.log(title,description,category,instructor,isPaid,price);

  if (!instructor ) {
    return res.status(400).json({ message: 'Invalid instructor ID.' });
  }
  console.log("Instructor ID:", instructor);
  const { thumbnail, video, pdf } = req.files || {};

  // Check if required fields are missing
  if (!title || !description || !category || !instructor) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Upload files to Cloudinary
    const thumbnailUpload = thumbnail?.[0]?.path
      ? await uploadToCloudinary(thumbnail[0].path, "course_thumbnails", "image")
      : null;

    const videoUpload = video?.[0]?.path
      ? await uploadToCloudinary(video[0].path, "course_videos", "video")
      : null;

    const pdfUpload = pdf?.[0]?.path
      ? await uploadToCloudinary(pdf[0].path, "course_pdfs", "raw")
      : null;

    // Create the course and save it to MongoDB
    const course = new Course({
      title,
      description,
      category,
      instructor,
      thumbnail: thumbnailUpload?.secure_url || "",
      videoUrl: videoUpload?.secure_url || "",
      pdfUrl: pdfUpload?.secure_url || "",
      isPaid,
      price,
    });

    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
};




// Edit a course
export const editCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, isPaid, price } = req.body;
  const { thumbnail, video, pdf } = req.files || {};

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Remove previous files from Cloudinary if new files are uploaded
    if (thumbnail && course.thumbnail) {
      const publicId = course.thumbnail.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }
    if (video && course.videoUrl) {
      const publicId = course.videoUrl.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }
    if (pdf && course.pdfUrl) {
      const publicId = course.pdfUrl.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    // Upload new files to Cloudinary
    const thumbnailUpload = thumbnail ? await uploadToCloudinary(thumbnail.path, "course_thumbnails") : null;
    const videoUpload = video ? await uploadToCloudinary(video.path, "course_videos") : null;
    const pdfUpload = pdf ? await uploadToCloudinary(pdf.path, "course_pdfs") : null;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        thumbnail: thumbnailUpload?.secure_url || course.thumbnail,
        videoUrl: videoUpload?.secure_url || course.videoUrl,
        pdfUrl: pdfUpload?.secure_url || course.pdfUrl,
        isPaid,
        price,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Remove files from Cloudinary
    if (course.thumbnail) {
      const publicId = course.thumbnail.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }
    if (course.videoUrl) {
      const publicId = course.videoUrl.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }
    if (course.pdfUrl) {
      const publicId = course.pdfUrl.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
};




// Get course by ID
export const getCourseById = async (req, res) => {
  console.log('fetching course by id');
  const { id } = req.params;
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    const course = await Course.findById(id)
      .populate("instructor", "username email role") // Populate instructor details
      .populate("studentsEnrolled", "username email role"); // Populate enrolled students

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};


// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    console.log('fetching all courses');
    // Fetch all courses from the database
    const courses = await Course.find()
      .populate("instructor", "username email role") // Populate instructor details
      .populate("studentsEnrolled", "username email role") // Populate enrolled students
      .sort({ createdAt: -1 }); // Sort by most recent courses

    res.status(200).json({
      totalCourses: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Error fetching all courses:", error);
    res.status(500).json({ message: "Error fetching all courses", error: error.message });
  }
};

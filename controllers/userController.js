import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// Delete local file after uploading to Cloudinary
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

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate role
    const validRoles = ["admin", "student", "instructor"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role provided" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check for existing user by email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Check for existing user by username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Generate token and set cookie
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: "", // Exclude password from response
      },
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login Controller
export const login = async (req, res) => {
  console.log("Login controller called");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: "", // Exclude password from response
      },
    });
    console.log("Login successful");
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("mern_lms");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Auth Check Controller
export const authCheck = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log("Error in authCheck controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};






// Profile Update Controller


// Profile Update Controller
export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const userId = req.user._id; // Assumes user ID is extracted from the authenticated token

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Handle profilePic upload to Cloudinary
    let profilePicUrl = user.profilePic;
    if (req.file) {
      // Remove old profilePic from Cloudinary if it exists
      if (user.profilePic) {
        const oldPublicId = user.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`profile_pics/${oldPublicId}`);
      }

      // Upload new profilePic to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.path, "profile_pics", "image");
      profilePicUrl = uploadResult.secure_url;
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username || user.username,
        bio: bio || user.bio,
        profilePic: profilePicUrl,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: {
        ...updatedUser._doc,
        password: "", // Exclude password from response
      },
    });
  } catch (error) {
    console.log("Error in updateProfile controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fetch All Instructors Controller
export const fetchAllInstructors = async (req, res) => {
  try {
    // Fetch users with role "instructor"
    const instructors = await User.find({ role: "instructor" }).select("-password"); // Exclude password

    if (!instructors.length) {
      return res.status(404).json({
        success: false,
        message: "No instructors found",
      });
    }

    res.status(200).json({
      success: true,
      instructors,
    });
  } catch (error) {
    console.log("Error in fetchAllInstructors controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

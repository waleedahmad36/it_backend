import express from 'express';
import { getAllUsers, getUnverifiedUsers, updateUserVerification } from '../controllers/adminController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/allusers',protectRoute, getAllUsers);


// Get all unverified users (for admin)
router.get("/unverified", getUnverifiedUsers);

// Update user verification (for admin - verify, unverify, delete)
router.post("/update-verification", updateUserVerification);

export default router;
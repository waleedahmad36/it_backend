import express from 'express';
import { getAllUsers } from '../controllers/adminController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/allusers',protectRoute, getAllUsers);

export default router;
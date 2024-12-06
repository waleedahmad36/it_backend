import express from 'express';
import { createCourse, updateCourse, getCourse, getAllCourses, deleteCourse } from '../controllers/courseControllers.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/create', protectRoute, createCourse);
router.put('/:id', protectRoute, updateCourse);
router.get('/:id', getCourse);
router.get('/', getAllCourses);
router.delete('/:id', protectRoute, deleteCourse);

export default router;

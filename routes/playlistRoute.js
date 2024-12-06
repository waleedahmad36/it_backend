import express from 'express';
import { createPlaylist, updatePlaylist, getPlaylist, getAllPlaylists, deletePlaylist, addCourseToPlaylist, removeCourseFromPlaylist } from '../controllers/playlistController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/create', protectRoute, createPlaylist);
router.put('/:id', protectRoute, updatePlaylist);
router.get('/:id', getPlaylist);
router.get('/', getAllPlaylists);
router.delete('/:id', protectRoute, deletePlaylist);
router.post('/add-course', protectRoute, addCourseToPlaylist);
router.post('/remove-course', protectRoute, removeCourseFromPlaylist);

export default router;

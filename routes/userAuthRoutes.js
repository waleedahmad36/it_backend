import express from 'express'
import { login, logout, signup,authCheck , updateProfile , fetchAllInstructors} from '../controllers/userController.js';
import {protectRoute} from '../middleware/protectRoute.js'
import upload from '../utils/multer.js';
const router = express.Router();


router.post('/signup',signup)



router.post('/login',login)

router.post('/logout',logout)


router.get('/authCheck',protectRoute,authCheck)
router.put("/profile/update", protectRoute, upload.single("profilePic"), updateProfile);
router.get('/instructors',fetchAllInstructors)



export default router;
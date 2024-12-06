import express from 'express'
import { login, logout, signup,authCheck , updateProfile , fetchAllInstructors} from '../controllers/userController.js';
import {protectRoute} from '../middleware/protectRoute.js'
// import upload from '../utils/multer.js';
import uploadProfile from '../utils/multerProfile.js';
const router = express.Router();


router.post('/signup',signup)



router.post('/login',login)

router.post('/logout',logout)


router.get('/authCheck',protectRoute,authCheck)
// router.put("/profile/update", protectRoute, upload.single("profilePic"), updateProfile);
router.put("/profile/update", protectRoute, uploadProfile, updateProfile);
router.get('/instructors',fetchAllInstructors)



export default router;
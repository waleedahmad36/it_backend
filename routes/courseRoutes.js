import express from "express";
import {
  createCourse,
  editCourse,
  deleteCourse,
  getCourseById,
  getAllCourses,
} from "../controllers/courseControllers.js";
import { protectRoute } from "../middleware/protectRoute.js";
import  upload  from "../utils/multer.js";

const router = express.Router();

router.post(
  "/courses",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createCourse
);

router.put("/courses/:id",protectRoute, upload.fields([{ name: "thumbnail" }, { name: "video" }, { name: "pdf" }]), editCourse);
router.delete("/courses/:id",protectRoute, deleteCourse);
router.get("/allcourses",protectRoute,getAllCourses);
router.get("/:id",protectRoute,getCourseById);

export default router;

import express from "express";
import { createQuiz, getAllQuizzes, getQuizById, markQuizAsPassed } from '../controllers/quizController.js';

const router = express.Router();

// Route to create a new quiz
router.post("/create", createQuiz);

// Route to get all quizzes
router.get("/quizzes", getAllQuizzes);

// Route to get a quiz by ID
router.get("/quiz/:id", getQuizById);

// Route to mark a quiz as passed by a student
router.post("/quiz/mark-passed", markQuizAsPassed);

export default router;

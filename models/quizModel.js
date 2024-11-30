import mongoose from "mongoose";

// Schema for the options in each question
const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true, // Whether the option is the correct answer
  },
});

// Schema for the questions in each topic
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [optionSchema],  // Array of options for the multiple-choice question
});

// Schema for each topic in the course
const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Topic name (e.g., HTML, CSS)
  },
  questions: [questionSchema],  // Array of questions under this topic
});

// Main quiz schema
const quizSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,  // Name of the course (e.g., Web Development)
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the User model
    ref: 'User',  // This will allow us to populate instructor data
    required: true,  // Instructor ID
  },
  topics: [topicSchema],  // Array of topics in the course
  studentsPassed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array to store student IDs who passed
});

// Create the model for quizzes
const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;

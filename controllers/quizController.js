import Quiz from '../models/quizModel.js';
  // Assuming you have a User model

// Controller to create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { courseName, instructor, topics } = req.body;

    // Create a new quiz
    const newQuiz = new Quiz({
      courseName,
      instructor,
      topics,
      studentsPassed: [],  // Initializing the empty array for students who passed
    });

    // Save the quiz to the database
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);  // Return the created quiz
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Failed to create quiz" });
  }
};

// Controller to get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();  // Find all quizzes
    res.status(200).json(quizzes);  // Return the list of quizzes
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};

// Controller to get a quiz by its ID
export const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);  // Find quiz by ID
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);  // Return the quiz data
  } catch (error) {
    console.error("Error fetching quiz by ID:", error);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

// Controller to mark a quiz as passed by a student
export const markQuizAsPassed = async (req, res) => {
  try {
    const { quizId, userId } = req.body;  // Get quizId and userId from the request body

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check if the student has already passed the quiz
    if (quiz.studentsPassed.includes(userId)) {
      return res.status(400).json({ message: "Student has already passed this quiz" });
    }

    // Add the student's ID to the studentsPassed array
    quiz.studentsPassed.push(userId);
    await quiz.save();  // Save the updated quiz

    res.status(200).json({ message: "Student marked as passed" });
  } catch (error) {
    console.error("Error marking quiz as passed:", error);
    res.status(500).json({ message: "Failed to mark quiz as passed" });
  }
};

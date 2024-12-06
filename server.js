import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import cors from "cors";
import playlistRoute from "./routes/playlistRoute.js"

dotenv.config();

const app = express();

app.use(
  cors({
    origin:'https://it-frontend-neon.vercel.app',
    credentials: true,
  })
);

// Middleware for parsing JSON and urlencoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", userAuthRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/playlist",playlistRoute)

// Start Server
app.listen(process.env.PORT || 5000, async () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
  await connectDB();
});

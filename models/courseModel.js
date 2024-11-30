import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(v);
        },
        message: "Invalid thumbnail",
      },
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    videoUrl: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(mp4|avi|mkv)$/.test(v) || v === "";
        },
        message: "Invalid video",
      },
    },
    pdfUrl: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(pdf)$/.test(v) || v === "";
        },
        message: "Invalid PDF",
      },
    },
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", category: 1 });

const Course = mongoose.model("Course", courseSchema);

export default Course;

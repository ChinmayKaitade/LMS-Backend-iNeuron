import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";

// getAllCourses logic
const getAllCourses = async (req, res) => {
  // get all courses
  try {
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
      success: true,
      message: "All Courses",
      courses,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// getLecturesByCourseId logic
const getLecturesByCourseId = async (req, res) => {
  // get all courses
};

export { getAllCourses, getLecturesByCourseId };

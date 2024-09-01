import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";

// getAllCourses logic
const getAllCourses = async (req, res, next) => {
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
const getLecturesByCourseId = async (req, res, next) => {
  // get all courses
  try {
    const { id } = req.params;

    const course = await Course.findById({ id });

    // if course doesn't exists
    if (!course) {
      return next(new AppError("Invalid Course Id", 500));
    }

    res.status(200).json({
      success: true,
      message: "Course Lectures fetched Successfully",
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export { getAllCourses, getLecturesByCourseId };

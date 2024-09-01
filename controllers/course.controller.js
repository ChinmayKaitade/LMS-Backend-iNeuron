import { error } from "console";
import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

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

// create course logic
const createCourse = async (req, res, next) => {
  // create course
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError("All fields are required", 400));
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail: {
      public_id: "dummy",
      secure_url: "dummy",
    },
  });

  if (!course) {
    return next(
      new AppError("Course could not be created. Please,try again later", 500)
    );
  }

  // uploading file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });

      // updating course thumbnail
      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }

      // removing file from local
      fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  }

  await course.save();

  res.status(200).json({
    success: true,
    message: "Course Created Successfully",
    course,
  });
};

// update course logic
const updateCourse = async (req, res, next) => {
  // update course
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );

    if (!course) {
      return next(new AppError("Course with given Id does not exists", 500));
    }

    res.status(200).json({
      success: true,
      message: "Course Updated Successfully",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// remove course logic
const removeCourse = async (req, res, next) => {
  // remove course
};

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
};

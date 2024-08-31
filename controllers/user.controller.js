import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true,
};

// register logic
const register = async (req, res, next) => {
  // register route
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  // finding user from db
  const userExists = await User.findOne({ email });

  // user exists
  if (userExists) {
    return next(new AppError("Email already exists", 400));
  }

  // user create
  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: "",
    },
  });

  // if user not created and saved
  if (!user) {
    return next(
      new AppError("User registration failed, Please try again later", 400)
    );
  }

  // TODO: File Upload
  // binary to image converted file and uploading image in cloudinary
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      // if we get result
      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // remove image file from server and storing it to cloudinary
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error || "File not uploaded, Please try again", 500)
      );
    }
  }

  await user.save();

  // generating JWT token
  const token = await user.generateJWTToken();

  // set token into cookie
  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
};

// login logic
const login = async (req, res) => {
  // login route
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    // user information
    const user = await User.findOne({
      email,
    }).select("+password");

    // user exists or doesn't exists
    if (!user || !user.comparePassword(password)) {
      return next(new AppError("Email or Password doesn't match", 400));
    }

    // if user exits, this will generate Token
    const token = await user.generateJWTToken();
    user.password = undefined;

    // token set into cookie
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User Logged In Successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// logout logic
const logout = (req, res) => {
  // logout route
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User Logged Out Successfully",
  });
};

// getProfile logic
const getProfile = async (req, res) => {
  // getProfile route
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: "User Details",
      user,
    });
  } catch (error) {
    return next(new AppError("Failed to fetch Profile details", 500));
  }
};

// forgot password logic
const forgotPassword = async (req, res, next) => {
  // forgot password route
  const { email } = req.body;

  // if email doesn't exists in database
  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  // if user does't exists in database
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Email not registered", 400));
  }

  const resetToken = await user.generatePasswordResetToken();

  // store token in database
  await user.save();

  // URL send in mail
  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const subject = "Reset Password";
  const message = `You can reset your password by clicking <a href=${resetPasswordURL} target="_blank">Reset Your Password</a>\nIf the above link doesn't work for some reason then copy paste this link in new tab ${resetPasswordURL}.\nIf you have not registered this, kindly ignore.`;

  try {
    await sendEmail(email, subject, message);

    res.status(200).json({
      success: true,
      message: `Reset Password token has been sent to ${email} successfully`,
    });
  } catch (error) {
    // if mail not send
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    await user.save();

    return next(
      new AppError(
        error.message || "Failed to sent token, Please try again later",
        500
      )
    );
  }
};

// reset password logic
const resetPassword = async (req, res) => {
  // reset password route
  const { resetToken } = req.params;

  const { password } = req.body;

  // generate forgot password token
  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // check for is user exists on token
  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError("Token is Invalid or Expired. Please, try again"),
      400
    );
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
};

export { register, login, logout, getProfile, forgotPassword, resetPassword };

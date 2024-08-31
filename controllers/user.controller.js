import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";

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
    console.log(req.file);

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

  res.status(201).send({
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

    res.status(200).send({
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

  res.status(200).send({
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

    res.status(200).send({
      success: true,
      message: "User Details",
      user,
    });
  } catch (error) {
    return next(new AppError("Failed to fetch Profile details", 500));
  }
};

export { register, login, logout, getProfile };

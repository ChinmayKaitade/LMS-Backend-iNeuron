import AppError from "../utils/error.util";

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

  await user.save();

  res.status(201).send({
    success: true,
    message: "User registered successfully",
    user,
  });
};

const login = (req, res) => {
  // login route
};

const logout = (req, res) => {
  // logout route
};

const getProfile = (req, res) => {
  // getProfile route
};

export { register, login, logout, getProfile };

import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  // if token doesn't exists
  if (!token) {
    return next(new AppError("Unauthenticated, Please Login again", 401));
  }

  // if token exists --> for getting user details
  const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

  // user details set into request of user
  req.user = userDetails;

  next();
};

export { isLoggedIn };

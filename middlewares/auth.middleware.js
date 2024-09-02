import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";

// User Authentication > User is logged in or not
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

// Authorization > User is Admin or not
const authorizedRoles =
  (...roles) =>
  async (req, res, next) => {
    const currentUserRoles = req.user.role;

    if (!roles.includes(currentUserRoles)) {
      return next(new AppError("You don't have to acess this route", 403));
    }

    next();
  };

// Authorized Subscriber
const authorizedSubscriber = async (req, res, next) => {
  const subscription = req.user.subscription;
  const currentUserRole = req.user.role;

  if (currentUserRole !== "ADMIN" && subscription.status !== "active") {
    return next(new AppError("Please Subscribe to access this route", 403));
  }

  next();
};

export { isLoggedIn, authorizedRoles, authorizedSubscriber };

// setup express server
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import courseRoute from "./routes/course.routes.js";
import paymentRoute from "./routes/payment.routes.js";
config();

const app = express();

app.use(express.json()); // parse req.body
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
); // CORS setup

app.use(cookieParser()); // for token parsing

app.use(morgan("dev")); // middleware for logging "dev" output in terminal

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/v1/user", userRoutes); // user route
app.use("/api/v1/courses", courseRoute); // courses route
app.use("/api/v1/payment", paymentRoute);

app.use("*", (req, res) => {
  res.status(404).send("OOPS! Page Not Found");
});

app.use(errorMiddleware);

export default app;

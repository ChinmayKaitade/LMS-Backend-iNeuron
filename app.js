// setup express server
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
config();

const app = express();

app.use(express.json()); // parse req.body

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

// OTHER ROUTES COMES HERE...

app.use("*", (req, res) => {
  res.status(404).send("OOPS! Page Not Found");
});

export default app;

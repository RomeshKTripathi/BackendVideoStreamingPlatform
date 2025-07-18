import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import { GlobalErrorHandler } from "./middlewares/errorHandler.middleware.js";
import { ApiError } from "./utils/ApiError.js";
import commentRouter from "./routes/comment.routes.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// routes

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("*", (req, res, next) => {
  const err = new ApiError(
    404,
    `Route ${req.originalUrl} not found`,
    "ERR_ROUTE_NOT_FOUND"
  );
  next(err);
});

app.use(GlobalErrorHandler);

// controllers
export { app };

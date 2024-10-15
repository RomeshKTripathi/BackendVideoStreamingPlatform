import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const tokenInformation = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(tokenInformation?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new ApiError(401, "Invalid Access Token"));
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(new ApiError(401, "Token expired, please login again"));
    }
    next(new ApiError(401, error?.message || "Invalid Access Token"));
  }
});

/**
 * If user is loggedin then add user data to req.
 */
export const addUserIfLoggedInUser = asyncHandler(async (req, res, next) => {
  const token = req?.cookies?.accessToken;
  if (!token) return next();

  const tokenInformation = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(tokenInformation?._id).select(
    "-password, -refreshToken"
  );

  if (!user) return next();

  req.user = user;
  return next();
});

export const verifyVideoAuthor = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw "Video ID is required for this operation.";
  }
  try {
    const video = await Video.findOne({ _id: id, owner: req.user._id });
    if (!video) {
      throw "Video not found or you do not have permission to delete this video.";
    }

    // Video found and user is the owner, move to the next middleware
    next();
  } catch (err) {
    // Pass the error to the global error handler
    return next(err);
  }
});

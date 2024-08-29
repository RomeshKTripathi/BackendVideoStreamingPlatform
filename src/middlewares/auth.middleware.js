import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Autherization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unautherized Request");
    }

    const tokenInformation = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(tokenInformation?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
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
  if (!id) throw new ApiError(401, "Video Id is Required to delete Video");
  const video = Video.findOne({ _id: id, owner: req.user._id });
  if (!video)
    throw new ApiError(
      401,
      "Unauthorized Request, Only owner can delete video"
    );

  next();
});

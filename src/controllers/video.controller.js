import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const videoLocalPath = req.files?.videoAsset[0].path;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;

  // console.log(videoLocalPath);
  // console.log(thumbnailLocalPath);
  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video File & Thumbnail image are Required !");
  }
  if (!title || !duration) {
    throw new ApiError(400, "Title & Duration Are required");
  }

  // Upload video on cloud
  const videoUrl = await uploadOnCloudinary(videoLocalPath);
  const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath);

  const video = await Video.create({
    videoFile: videoUrl.url,
    thumbnail: thumbnailUrl.url,
    title,
    description,
    duration,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Uploaded Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  // Update video details
});

const getVideoById = asyncHandler(async (req, res) => {
  // find video by id and return
});

const deleteVideo = asyncHandler(async (req, res) => {
  // Delete Video by video Id
});

const getAllVideos = asyncHandler(async (req, res) => {
  // return all videos of channel
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  // toggle video publish status.
});

export {
  uploadVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  togglePublishStatus,
  updateVideo,
};

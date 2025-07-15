import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const videoLocalPath = req.files?.videoAsset[0].path;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(401, "Video File & Thumbnail image are Required !");
  }
  if (!title || !duration) {
    throw new ApiError(401, "Title & Duration Are required");
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

const updateDetails = asyncHandler(async (req, res) => {
  // thumbnail, title, description, isPublished can be updated.
  const { id } = req.params;
  const { title, description, isPublished } = req.body;
  const result = await Video.updateOne(
    { _id: id },
    {
      $set: {
        description,
        title,
        isPublished,
      },
    }
  );

  res.status(200).json(new ApiResponse(200, result, "Details Updated"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new Error(401, "Video id is required.");
  }
  const video = await Video.findById(id);
  await Video.updateOne({ _id: id }, { $inc: { views: 1 } });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        video ? "Successfully returned Video" : "Video Not found"
      )
    );

  // const video = await Video.findById(id);
  // res.status(200).json(new ApiResponse(200, video, "Processd Successfully"));

  // find video by id and return
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleteResult = await Video.deleteOne({ _id: id });

  res
    .status(200)
    .json(new ApiResponse(200, deleteResult, "Successfully Deleted"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  let allVideos = await Video.find({
    owner: req.user._id,
  }).select("-createdAt -updatedAt -owner -__v -duration");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allVideos,
        allVideos.length ? "All Videos" : "No Video Found"
      )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  // toggle video publish status.
  const { id } = req.params;
  const video = await Video.findById(id);
  const updateResult = await Video.updateOne(
    { _id: id },
    { $set: { isPublished: !video.isPublished } }
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        video.isPublished
          ? "Video Unpublished"
          : "Video Published" + " Successfully"
      )
    );
});

export {
  uploadVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  togglePublishStatus,
  updateDetails,
};

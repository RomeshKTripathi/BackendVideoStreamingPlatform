import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validateObjectId } from "../utils/UtilityMethods.js";

const videoRouteHealthCheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video Route is healthy"));
});

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
  const videoCloudinary = await uploadOnCloudinary(videoLocalPath);
  const thumbnailCloudinary = await uploadOnCloudinary(thumbnailLocalPath);
  console.log(videoCloudinary, thumbnailCloudinary);

  const video = await Video.create({
    video: {
      ...videoCloudinary,
    },
    thumbnail: { ...thumbnailCloudinary },
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

export const updateThumbnail = asyncHandler(async (req, res) => {
  // update thumbnail of video.
  const { id } = req.params;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;
  if (!thumbnailLocalPath) {
    throw new ApiError(401, "Thumbnail image is required");
  }
  // upload thumbnail on cloud
  const thumbnailCloudinary = await uploadOnCloudinary(thumbnailLocalPath);
  // update video thumbnail
  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  // delete old thumbnail from cloud
  await deleteFromCloudinary(video.thumbnail);
  // update video thumbnail
  const result = await Video.updateOne(
    { _id: id },
    {
      $set: {
        thumbnail: thumbnailCloudinary,
      },
    }
  );
  res
    .status(200)
    .json(new ApiResponse(200, result, "Thumbnail Updated Successfully"));
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
  const { id: videoId } = req.params;
  // perform checks
  validateObjectId([videoId]);

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // delete from cloudinary
  await deleteFromCloudinary(video.video);
  await deleteFromCloudinary(video.thumbnail);

  // delete from db
  await Video.findByIdAndDelete(videoId);

  // return response
  res.status(200).json(new ApiResponse(200, [], "Successfully Deleted"));
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
  videoRouteHealthCheck,
};

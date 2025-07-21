import { asyncHandler } from "../utils/asyncHandler.js";
import { validateObjectId } from "../utils/UtilityMethods.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";

const createLikeResponseObject = (isLiked) => {
  return {
    isLiked,
  };
};

export const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  validateObjectId([videoId]);

  const unliked = await Like.findOneAndDelete({
    video: videoId,
    likedBy: userId,
  });

  if (unliked) {
    await Video.updateOne({ _id: videoId }, { $inc: { likeCount: -1 } });
    return res
      .status(200)
      .json(new ApiResponse(200, createLikeResponseObject(false), "Unliked"));
  }

  await Like.create({ video: videoId, likedBy: userId });
  await Video.updateOne({ _id: videoId }, { $inc: { likeCount: 1 } });

  return res
    .status(200)
    .json(new ApiResponse(200, createLikeResponseObject(true), "Liked"));
});

export const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  validateObjectId([commentId]);

  const unliked = await Like.findOneAndDelete({
    comment: commentId,
    likedBy: userId,
  });

  if (unliked) {
    await Comment.updateOne({ _id: commentId }, { $inc: { likeCount: -1 } });
    return res
      .status(200)
      .json(new ApiResponse(200, createLikeResponseObject(false), "Unliked"));
  }

  await Like.create({ comment: commentId, likedBy: userId });
  await Comment.updateOne({ _id: commentId }, { $inc: { likeCount: 1 } });

  return res
    .status(200)
    .json(new ApiResponse(200, createLikeResponseObject(true), "Liked"));
});

export const getTotalLikesOnVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  validateObjectId([videoId]);

  const totalLikes = await Like.countDocuments({ video: videoId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { totalLikes }, "Total likes fetched successfully")
    );
});

export const getTotalLikesOnComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  validateObjectId([commentId]);
  const totalLikes = await Like.countDocuments({ comment: commentId });
  return res
    .status(200)
    .json(
      new ApiResponse(200, { totalLikes }, "Total likes fetched successfully")
    );
});

import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  validateCommentVideoRelation,
  validateInputFields,
  validateObjectId,
  validateUserCommentOwnership,
  updateDocument,
} from "../utils/UtilityMethods.js";

const healthCheck = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "Server is healthy"));
});

const addNewComment = asyncHandler(async (req, res) => {
  const { content, video_id } = req.body;
  const user_id = req.user._id;
  validateInputFields([video_id, content]);
  validateObjectId([video_id, user_id]);

  if (!content.trim()) {
    throw new ApiError(400, "Content cannot be empty");
  }

  // Add comment to database
  const newComment = await Comment.create({
    content,
    video: video_id,
    owner: user_id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newComment, "new comment added"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { updatedComment, video_id, commentId } = req.body;

  validateInputFields([video_id, updatedComment, commentId]);
  validateObjectId([video_id, commentId]);

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  validateUserCommentOwnership(comment, req.user);
  validateCommentVideoRelation(comment, video_id);

  const updatedCommentData = await updateDocument(commentId, updatedComment);

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCommentData, "Comment Updated Successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId, video_id } = req.body;
  validateInputFields([video_id, commentId]);
  validateObjectId([video_id, commentId]);
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  validateUserCommentOwnership(comment, req.user);
  validateCommentVideoRelation(comment, video_id);

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

const getCommentsOfVideo = asyncHandler(async (req, res) => {
  const { video_id } = req.body;

  validateObjectId([video_id]);

  const comments = await Comment.find({ video: video_id })
    .populate("owner", "username profilePicture")
    .sort({ createdAt: -1 });

  if (!comments || comments.length === 0) {
    throw new ApiError(404, "No comments found for this video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});

// Utility Functions

export {
  addNewComment,
  deleteComment,
  updateComment,
  healthCheck,
  getCommentsOfVideo,
};

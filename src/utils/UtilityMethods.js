import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "./ApiError.js";

export function fieldValue(fields) {
  for (const field of fields) {
    if (!field || field.trim() === "") {
      return false;
    }
  }
  return true;
}

export function validateObjectId(ids) {
  for (const ObjectId of ids) {
    if (!mongoose.Types.ObjectId.isValid(ObjectId)) {
      throw new ApiError(400, "Invalid ObjectId format");
    }
  }
}
export function validateInputFields(fields) {
  for (const field of fields) {
    if (!field || !field.trim()) throw new ApiError(400, "Fields are missing");
  }
}

export function validateUserCommentOwnership(comment, user) {
  if (comment.owner.toString() !== user._id.toString()) {
    throw new ApiError(
      403,
      "You do not have permission to modify this comment"
    );
  }
}
export function validateCommentVideoRelation(comment, video_id) {
  if (comment.video.toString() !== video_id) {
    throw new ApiError(400, "Comment does not belong to the specified video");
  }
}
export async function updateDocument(commentId, updatedComment) {
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content: updatedComment },
    { new: true }
  );
  if (!comment) {
    throw new ApiError(404, "Comment not found for update");
  }
}
export function validateVideoOwnership(video, user) {
  if (video.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "You do not have permission to modify this video");
  }
}

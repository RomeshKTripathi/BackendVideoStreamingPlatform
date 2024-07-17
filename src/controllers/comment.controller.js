import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async () => {
  // Add a new comment
});

const updateComment = asyncHandler(async () => {
  // update a comment
});

const deleteComment = asyncHandler(async () => {
  // delete a comment
});

const getCommentsOfVideo = asyncHandler(async () => {
  // return all comments of video.
});

export { addComment, deleteComment, updateComment, getCommentsOfVideo };

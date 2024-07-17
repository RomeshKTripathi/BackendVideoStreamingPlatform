import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async () => {
  // toggle video like
});

const toggleCommentLike = asyncHandler(async () => {
  // toggle comment like
});

const getLikedVideos = asyncHandler(async () => {
  // return all liked videos of the user.
});

export { toggleCommentLike, toggleVideoLike, getLikedVideos };

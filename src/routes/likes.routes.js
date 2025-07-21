import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getTotalLikesOnComment,
  getTotalLikesOnVideo,
  toggleCommentLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const router = Router();
const dummyHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Likes route is working",
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user,
  });
};
router.route("/health-check").get((req, res) => {
  res.status(200).json(new ApiResponse(200, {}, "OK"));
});
// routes to get total likes on comments and videos
router.route("/comment/all/:commentId").get(getTotalLikesOnComment);
router.route("/video/all/:videoId").get(getTotalLikesOnVideo);

router.use(verifyJWT); // Apply JWT verification middleware to all routes below
router.route("/comment/toggle/:commentId").post(toggleCommentLike);
router.route("/video/toggle/:videoId").post(toggleVideoLike);

export default router;

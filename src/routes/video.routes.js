import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
  updateDetails,
  updateThumbnail,
  uploadVideo,
  videoRouteHealthCheck,
} from "../controllers/video.controller.js";
import {
  verifyJWT,
  verifyVideoAuthor,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoAsset",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);
router.route("/thumbnail/:id").post(
  verifyJWT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateThumbnail
);
router.route("/health-check").get(videoRouteHealthCheck);
router.route("/:id").get(getVideoById);
router.route("/delete/:id").delete(verifyJWT, verifyVideoAuthor, deleteVideo);
router.route("/my-videos").get(verifyJWT, getAllVideos);
router.route("/update/:id").patch(verifyJWT, verifyVideoAuthor, updateDetails);
router
  .route("/publish/:id")
  .patch(verifyJWT, verifyVideoAuthor, togglePublishStatus);
export default router;

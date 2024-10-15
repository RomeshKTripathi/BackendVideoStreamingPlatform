import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
  updateDetails,
  uploadVideo,
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

router.route("/video/:id").get(getVideoById);
router.route("/delete/:id").delete(verifyJWT, verifyVideoAuthor, deleteVideo);
router.route("/my-videos").get(verifyJWT, getAllVideos);
router.route("/update/:id").patch(verifyJWT, verifyVideoAuthor, updateDetails);
router
  .route("/publish/:id")
  .patch(verifyJWT, verifyVideoAuthor, togglePublishStatus);
export default router;

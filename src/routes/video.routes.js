import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVideo,
  getVideoById,
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

router.route("/:id").get(getVideoById);
router.route("/delete/:id").delete(verifyJWT, verifyVideoAuthor, deleteVideo);

export default router;

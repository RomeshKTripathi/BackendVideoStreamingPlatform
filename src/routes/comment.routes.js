import { Router } from "express";
import {
  addNewComment,
  deleteComment,
  getCommentsOfVideo,
  healthCheck,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/health").get(verifyJWT, healthCheck);
router.route("/new").post(verifyJWT, addNewComment);
router.route("/edit").patch(verifyJWT, updateComment);
router.route("/delete").delete(verifyJWT, deleteComment);
router.route("/").get(verifyJWT, getCommentsOfVideo);

export default router;

import { Router } from "express";
import {
  changePassword,
  getChannel,
  getCurrentUser,
  getWatchHistory,
  logOut,
  loginUser,
  registerUser,
  subscribe,
  updateAvatar,
  updateDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addUserIfLoggedInUser,
  verifyJWT,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// TODO: rewrite all routes

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logOut);
router.route("/change-password").patch(verifyJWT, changePassword);
router.route("/update-details").patch(verifyJWT, updateDetails);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("/avatar"), updateAvatar);
router.route("/get-user").get(verifyJWT, getCurrentUser);
router.route("/subscribe").post(verifyJWT, subscribe);
router.route("/get-channel").get(addUserIfLoggedInUser, getChannel);
router.route("/get-watch-history").get(verifyJWT, getWatchHistory);
export default router;

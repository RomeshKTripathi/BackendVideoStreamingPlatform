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

router.route("/login").post(loginUser);
router.route("/channel").get(addUserIfLoggedInUser, getChannel);

// These routes require authentication
router.use(verifyJWT);
router.route("/logout").post(logOut);
router.route("/change-password").patch(changePassword);
router.route("/profile").patch(updateDetails);
router.route("/update-avatar").patch(upload.single("avatar"), updateAvatar);
router.route("/me").get(getCurrentUser);
router.route("/subscribe").post(subscribe);
router.route("/watch-history").get(getWatchHistory);
export default router;

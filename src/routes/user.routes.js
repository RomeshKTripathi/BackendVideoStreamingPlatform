import { Router } from "express";
import {
  changePassword,
  getChannel,
  getCurrentUser,
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
router.route("/logout").post(verifyJWT, logOut);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-details").post(verifyJWT, updateDetails);
router.route("/update-avatar").post(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateAvatar
);
router.route("/get-user").post(verifyJWT, getCurrentUser);
router.route("/subscribe").post(verifyJWT, subscribe);
router.route("/get-channel").post(addUserIfLoggedInUser, getChannel);
export default router;

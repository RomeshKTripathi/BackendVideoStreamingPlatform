import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ valdateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Token");
  }
};

// Register New User
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  console.log("finding user with email | username");

  const userExistence = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExistence) {
    console.log(userExistence);
    throw new ApiError(409, "User with email or username already registerd");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage
    ? req.files?.coverImage[0]?.path
    : "";

  if (!avatarLocalPath) throw new ApiError(400, "Avatar image is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });
  const createdUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong in Registration");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully"));
});

// Login User and create Session.
const loginUser = asyncHandler(async (req, res) => {
  // extract user data from request
  const { email, username, password } = req.body;
  // validation of data
  if (!username && !email) {
    throw new ApiError(400, "Username/email is required");
  }

  // check user exist with username or email
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(401, "No User found with email/username");
  }

  if (!(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Password is Incorrect");
  }

  // Create Login session
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // set access token and refresh token to cookies

  console.log(loggedInUser);
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "User Logged in Successfully"
      )
    );
});

const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body;

  if (!newPassword || !oldPassword) {
    throw new ApiError(
      400,
      "Missing required fields: newPassword / oldPassword.",
      "ERR_MISSING_PASSWORD_FIELDS"
    );
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password Changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched Successfully"));
});

const updateDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = req.user;

  if (user.fullname === fullname.trim() && user.email === email.trim())
    return res
      .status(200)
      .json(new ApiResponse(200, user, "No changes applied"));

  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser._id.toString() !== user._id.toString()) {
    throw new ApiError(409, "Email is already in use", "ERR_EMAIL_EXISTS");
  }
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: { fullname, email },
    },
    {
      new: true, // ✅ Return updated document
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Details Updated Successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  // extract local path of File
  const avatarLocalPath = req.files?.avatar.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // upload it on cloudinary
  const newAvatar = await uploadOnCloudinary(avatarLocalPath);

  if (!newAvatar.url) {
    throw new ApiError(500, "Error while uploading Avatar");
  }
  // update new url in database
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      avatar: newAvatar.url,
    },
  }).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Updated Successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const { coverImageLocalPath } = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image is Missing");
  }

  const coverImageCloudinaryPath = uploadOnCloudinary(coverImageLocalPath);
  if (!coverImageCloudinaryPath) {
    throw new ApiError(500, "Error while uploading coverImage on cloudinary");
  }

  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      coverImage: coverImageCloudinaryPath.url,
    },
  }).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image updated Successfully"));
});

const subscribe = asyncHandler(async (req, res) => {
  const { channelId } = req.query;

  if (!channelId?.trim()) {
    throw new ApiError(401, "Channel Id is Required");
  }

  if (!(await User.findById(channelId))) {
    throw new ApiError(400, "Invalid Channel Id");
  }

  await Subscription.create({
    channel: channelId,
    subscriber: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, {}, "Channel Subscribed"));
});

const getChannel = asyncHandler(async (req, res) => {
  console.log(req.method);
  const { username } = req.query;

  if (!username?.trim()) {
    throw new ApiError(400, "channelId required");
  }

  const result = await User.aggregate([
    {
      $match: {
        username,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscribers",
        as: "subscription",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscriptionsCount: {
          $size: "$subscription",
        },
        subscribed: {
          $cond: {
            if: req?.user === undefined,
            then: "undefined",
            else: {
              $in: [req.use?._id, "$subscribers"],
            },
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        email: 1,
        coverImage: 1,
        avatar: 1,
        subscriptionsCount: 1,
        subscribersCount: 1,
        subscribed: 1,
      },
    },
  ]);
  const responseMessage = result.length
    ? "Channel found Successfully"
    : "No channel found !";

  return res
    .status(200)
    .json(new ApiResponse(200, result[0] ?? {}, responseMessage));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  console.log("Watch History");

  const user = await User.aggregate([
    {
      $match: {
        _id: new ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
                {
                  $addFields: {
                    owner: {
                      $first: "$owner",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);
  console.log(user);
});

export {
  registerUser,
  loginUser,
  logOut,
  changePassword,
  getCurrentUser,
  updateDetails,
  updateAvatar,
  updateCoverImage,
  subscribe,
  getChannel,
  getWatchHistory,
};

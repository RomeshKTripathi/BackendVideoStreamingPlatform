import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";
// Registration of the user.

const registerUser = asyncHandler(async (req, res) => {
  // Get User Details
  // Validation (Should have all required details/documents)
  // Check if user already registerd
  // upload files to cloudinary
  // Create user Object -> Create entry in DB.
  // return response without password and refresh token field.
  const { fullname, email, username, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userExistence = User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExistence) {
    throw new ApiError(409, "User with email or username already registerd");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar image is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });
  const createdUser = User.findById(user.id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong in Registration");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully"));
});

const loginUser = asyncHandler((req, res) => {
  //TODO: data from req body
  // username or email based login
  // find the user
  // check the password
  // generate access and refresh token
  // send secured cookie
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }
});

export { registerUser, loginUser };

/**
 * Take data from User
 * validate data
 * check if the user already registerd or not
 * save data to database
 * give feedback to user.
 */

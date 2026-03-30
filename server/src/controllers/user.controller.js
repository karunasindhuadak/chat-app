import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new ApiError(
      500,
      error.message || "Something went wrong while generating tokens",
    );
  }
};

// @desc Signup a new user
const signupUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  if (
    [fullName, email, password, bio].some(
      (field) => !field || field?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existUser = await User.findOne({ email });

  if (existUser) {
    throw new ApiError(400, "Account already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    bio,
  });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const signedUpUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: signedUpUser,
          accessToken,
          refreshToken,
        },
        "User signed up successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }
  const isCorrectPassword = await user.isPasswordCorrect(password);

  if (!isCorrectPassword) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Controller to check if the user is authenticated
const checkAuth = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: req.user,
      },
      "User is authenticated",
    ),
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, bio } = req.body;
  const avatarLocalPath = req.file?.path;

  const userId = req.user._id;
  const oldAvatar = await User.findById(userId).select("avatar");
  let avatarData = {};

  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(500, "Failed to upload avatar");
    }
    avatarData = {
      avatar: {
        url: avatar.secure_url,
        publicId: avatar.public_id,
      },
    };
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        fullName,
        bio,
        ...avatarData,
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  // delete old avatar ONLY if new one uploaded
  if (avatarLocalPath && oldAvatar?.avatar?.publicId) {
    await deleteFromCloudinary(oldAvatar.avatar.publicId);
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: updatedUser,
      },
      "Profile updated successfully",
    ),
  );
});

export { signupUser, loginUser, logoutUser, checkAuth, updateProfile };

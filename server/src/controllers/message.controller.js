import { io, userSocketMap } from "../app.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all user except logged in user
const getUserforSlidebar = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user?._id;
  const filterdUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
    "-password -refreshToken",
  );

  // Get the count of unseen messages for each user
  const unseenMessages = {};
  const promises = filterdUsers.map(async (user) => {
    const messages = await Message.find({
      senderId: user._id,
      receiverId: loggedInUserId,
      seen: false,
    });
    if (messages.length > 0) {
      unseenMessages[user._id] = messages.length;
    }
  });
  await Promise.all(promises);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users: filterdUsers,
        unseenMessages,
      },
      "Users fetched successfully",
    ),
  );
});

// Get all messages for selected user
const getMessages = asyncHandler(async (req, res) => {
  const { id: selectedUserId } = req.params;
  const loggedInUserId = req.user?._id;

  const messages = await Message.find({
    $or: [
      { senderId: selectedUserId, receiverId: loggedInUserId },
      { senderId: loggedInUserId, receiverId: selectedUserId },
    ],
  });

  await Message.updateMany(
    { senderId: selectedUserId, receiverId: loggedInUserId, seen: false },
    { $set: { seen: true } },
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages,
      },
      "Messages fetched successfully",
    ),
  );
});

// api to mark message as seen using message id || small improvement require
const markMessageAsSeen = asyncHandler(async (req, res) => {
  const { id } = req.params; // id --> messageId
  const loggedInUserId = req.user?._id;
  const message = await Message.findById(id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.receiverId.toString() !== loggedInUserId.toString()) {
    throw new ApiError(403, "Not allowed to mark this message as seen");
  }

  if (!message.seen) {
    message.seen = true;
    await message.save();
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        message.seen
          ? "Message marked as seen successfully"
          : "Message already marked as seen",
      ),
    );
});

// Send message to selected user
const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const selectedUserId = req.params.id;
  const loggedInUserId = req.user?._id;
  const imageLocalPath = req.file?.path;

  if (!loggedInUserId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!text?.trim() && !imageLocalPath) {
    throw new ApiError(400, "Message can't be empty");
  }

  let imageData = null;
  if (imageLocalPath) {
    const image = await uploadOnCloudinary(imageLocalPath);
    if (!image) {
      throw new ApiError(500, "Failed to upload image");
    }
    imageData = image.secure_url;
  }
  const newMessage = await Message.create({
    senderId: loggedInUserId,
    receiverId: selectedUserId,
    text: text?.trim(),
    image: imageData,
  });

  const receiverSocketId = userSocketMap[selectedUserId];

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message sent successfully"));
});

export { getUserforSlidebar, getMessages, markMessageAsSeen, sendMessage };

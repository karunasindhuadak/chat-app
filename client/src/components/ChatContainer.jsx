import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/util";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImg] = useState(null);
  const scrollEnd = useRef();

  // handle image selection for message
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImg(file);
    }
  };

  // handle message submission
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "" && !selectedImage) return null;

    const formData = new FormData();
    if (input.trim()) formData.append("text", input.trim());
    if (selectedImage) formData.append("image", selectedImage);

    await sendMessage(formData);
    setInput("");
    setSelectedImg(null);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full relative overflow-scroll backdrop-blur-lg border-r border-white/10">
      {/* Chat Header */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-white/10 bg-black/20">
        <img
          src={selectedUser.avatar?.url || assets.avatar_icon}
          alt=""
          className="w-8 h-8 rounded-full"
        />
        <p className="flex-1 text-white text-lg gap-2 flex items-center font-medium">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          alt=""
          className="max-md:hidden max-w-5 opacity-70"
        />
      </div>
      {/* Chat Body */}
      <div className="flex flex-col h-[calc(100%-120px)] p-4 pb-6 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end justify-end gap-2 ${msg.senderId !== authUser._id && "flex-row-reverse"}`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className={`max-w-[230px] border border-white/10 rounded-lg overflow-hidden ${msg.text ? "mb-2" : "mb-8"}`}
              />
            ) : null}
            {msg.text ? (
              <p
                className={`${msg.image ? "" : "mb-8"} p-2.5 max-w-[220px] md:text-sm rounded-lg break-all font-light text-white ${msg.senderId === authUser._id ? "bg-violet-600/40 rounded-br-none" : "bg-white/10 rounded-bl-none"}`}
              >
                {msg.text}
              </p>
            ) : null}


            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser.avatar?.url || assets.avatar_icon
                    : selectedUser.avatar?.url || assets.avatar_icon
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500 mt-1">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom area */}

      <div className="absolute bottom-0 left-0 right-0 p-3 gap-3 flex items-center bg-black/20 border-t border-white/10">
        <div className="flex-1 flex items-center rounded-full bg-white/5 border border-white/10 px-4">
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" ? handleMessageSubmit(e) : null
            }
            value={input}
            type="text"
            placeholder="Send a message..."
            className="flex-1 border-none outline-none p-3 rounded-lg placeholder-gray-400 text-white text-sm"
          />
          <input
            type="file"
            name=""
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleImageChange}
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer opacity-70 hover:opacity-100"
            />
          </label>
        </div>
        <img
          onClick={handleMessageSubmit}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer hover:opacity-80"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center gap-2 bg-black/10 text-gray-400">
      <img
        src={assets.logo_icon}
        alt=""
        className="max-w-16"
      />
      <p className="text-lg font-medium text-gray-300">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;


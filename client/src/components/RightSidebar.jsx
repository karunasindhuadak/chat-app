import React, { useContext, useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);
  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}
      >
        <div className="mt-16 flex flex-col items-center gap-2 text-xs font-light">
          <img
            src={selectedUser.avatar?.url || assets.avatar_icon}
            alt=""
            className="w-20 aspect-square rounded-full"
          />
          <h2 className="px-10 mx-auto font-medium text-xl flex items-center gap-2">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <p className="w-2 h-2 rounded-full bg-green-500"></p>
            )}
          </h2>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>

        <hr className="my-3" />

        <div className="px-3 text-xs">
          <p>Media</p>
          <div className="grid grid-cols-2 gap-4 mt-2 max-h-[200px] overflow-y-scroll opacity-80">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="rounded cursor-pointer"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-20 rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;

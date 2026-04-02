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
        className={`bg-black/20 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}
      >
        <div className="mt-16 flex flex-col items-center gap-2 text-xs font-light">
          <img
            src={selectedUser.avatar?.url || assets.avatar_icon}
            alt=""
            className="w-20 aspect-square rounded-full border-2 border-white/15"
          />
          <h2 className="px-10 mx-auto font-medium text-xl flex items-center gap-2 mt-2">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <p className="w-2 h-2 rounded-full bg-green-400"></p>
            )}
          </h2>
          <p className="px-10 mx-auto text-gray-400">{selectedUser.bio}</p>
        </div>

        <hr className="my-4 border-white/10 mx-4" />

        <div className="px-4 text-xs">
          <p className="text-gray-400 font-medium uppercase tracking-wide">Media</p>
          <div className="grid grid-cols-2 gap-3 mt-3 max-h-[200px] overflow-y-scroll">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-light py-2 px-20 rounded-full cursor-pointer hover:opacity-90"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;


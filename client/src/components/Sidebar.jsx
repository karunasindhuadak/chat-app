import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();
  const [input, setInput] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);

  // Close menu when tapping outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase()),
      )
    : users;
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div
      className={`bg-black/20 h-full overflow-y-scroll p-5 text-white border-r border-white/10 ${selectedUser ? "max-md:hidden" : ""}`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img
            src={assets.logo}
            alt="logo"
            className="max-w-40 max-h-9"
          />
          <div className="py-2 relative" ref={menuRef}>
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
              onClick={() => setMenuVisible((prev) => !prev)}
            />
            {menuVisible && (
              <div className="absolute top-full right-0 z-20 w-32 border border-white/10 rounded-lg bg-[#1a1530]/95 backdrop-blur-md text-gray-200 p-4">
                <p
                  onClick={() => {
                    navigate("/profile");
                    setMenuVisible(false);
                  }}
                  className="text-sm cursor-pointer hover:text-violet-400"
                >
                  Edit Profile
                </p>
                <hr className="my-2 border-t border-white/10" />
                <p
                  onClick={() => {
                    logout();
                    setMenuVisible(false);
                  }}
                  className="text-sm cursor-pointer hover:text-violet-400"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5 px-4 py-3 bg-white/5 border border-white/10 rounded-full">
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-3 opacity-70"
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="flex-1 border-none outline-none bg-transparent text-white text-xs placeholder:text-gray-400"
            placeholder="Search User..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            key={index}
            className={`relative flex gap-3 p-3 pl-4 rounded-lg items-center text-sm sm:text-lg cursor-pointer hover:bg-white/5 ${selectedUser?._id === user._id && "bg-white/10"}`}
          >
            <img
              src={user.avatar?.url || assets.avatar_icon}
              alt="Avatar"
              className="w-[35px] aspect-square rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-xs text-green-400">Online</span>
              ) : (
                <span className="text-xs text-gray-500">Offline</span>
              )}
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 flex justify-center items-center rounded-full h-5 w-5 bg-violet-500 text-xs text-white">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;


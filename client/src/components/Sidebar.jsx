import React, { useContext, useEffect, useState } from "react";
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
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase()),
      )
    : users;
  useEffect(() => {
    getUsers();
  }, [onlineUsers]);
  return (
    <div
      className={`bg-[#8185B2]/10 h-full overflow-y-scroll p-5 rounded-r-xl text-white ${selectedUser ? "max-md:hidden" : ""}`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img
            src={assets.logo}
            alt="logo"
            className="max-w-40"
          />
          <div className="py-2 relative group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 border border-gray-600 rounded-md bg-[#282142] text-gray-100 p-5 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="text-sm cursor-pointer"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p
                onClick={() => logout()}
                className="text-sm cursor-pointer"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5 px-4 py-3 bg-[#282142] rounded-full">
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-3"
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="flex-1 border-none outline-none bg-transparent text-white text-xs placeholder:text-gray-300"
            placeholder="Search User..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            key={index}
            className={`relative flex gap-2 p-2 pl-4 rounded items-center text-sm sm:text-lg cursor-pointer ${selectedUser?._id === user._id && "bg-[#282142]/50"}`}
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
                <span className="text-xs text-neutral-400">Offline</span>
              )}
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 flex justify-center items-center rounded-full h-5 w-5 bg-violet-500/50 text-xs ro">
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

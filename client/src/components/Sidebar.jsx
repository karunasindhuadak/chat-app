import React, { useContext } from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
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
            type="text"
            className="flex-1 border-none outline-none bg-transparent text-white text-xs placeholder:text-gray-300"
            placeholder="Search User..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {userDummyData.map((user, index) => (
          <div
            onClick={() => setSelectedUser(user)}
            key={index}
            className={`relative flex gap-2 p-2 pl-4 rounded items-center text-sm sm:text-lg cursor-pointer ${selectedUser?._id === user._id && "bg-[#282142]/50"}`}
          >
            <img
              src={user.profilePic}
              alt="Avatar"
              className="w-[35px] aspect-square rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {index < 3 ? (
                <span className="text-xs text-green-400">Online</span>
              ) : (
                <span className="text-xs text-neutral-400">Offline</span>
              )}
            </div>
            {index > 2 && (
              <p className="absolute top-4 right-4 flex justify-center items-center rounded-full h-5 w-5 bg-violet-500/50 text-xs ro">
                {index}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

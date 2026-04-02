import React, { useState, useMemo, useEffect } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const [loading, setLoading] = useState(false);

  // Create object URL once per selected file, and revoke on cleanup
  const previewUrl = useMemo(() => {
    if (!selectedImg) return null;
    return URL.createObjectURL(selectedImg);
  }, [selectedImg]);

  // Revoke old object URL when it changes or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("bio", bio);
    if (selectedImg) {
      formData.append("avatar", selectedImg);
    }
    await updateProfile(formData);
    navigate("/");
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex justify-center items-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-xl bg-black/40 border border-white/10 text-gray-300 flex items-center justify-between max-sm:flex-col-reverse rounded-xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h2 className="text-lg font-medium text-white">Profile details</h2>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer text-sm text-gray-400 hover:text-gray-300"
          >
            <input
              onChange={(e) => {
                setSelectedImg(e.target.files[0]);
              }}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                previewUrl || authUser?.avatar?.url || assets.avatar_icon
              }
              alt=""
              className={`w-15 h-15 ${(previewUrl || authUser?.avatar?.url) && "rounded-full"}`}
            />
            upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
            className="p-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          ></textarea>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-3 rounded-lg text-lg cursor-pointer font-medium hover:opacity-90"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
        <img
          src={
            previewUrl || authUser?.avatar?.url || assets.logo_icon
          }
          alt=""
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && "rounded-full"}`}
        />
      </div>
    </div>
  );
};

export default ProfilePage;

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaTelegram,
} from "react-icons/fa6";
import { format } from "timeago.js";
import { FaEye } from "react-icons/fa";

const ProfilePage = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { user } = useUser();

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfileData(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [getToken]);

  if (loadingProfile) return <div>Loading profile...</div>;

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6 p-4">
      <h1 className="text-xl font-light">Profile</h1>
      <div className="flex flex-col gap-6 flex-1 mb-6">
        {/* Profile Picture */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-[#1b1c1c] text-[#e0e0e0] text-3xl font-semibold shadow-md">
          <img
            src={
              profileData?.imageUrl
                ? `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}${profileData.imageUrl}`
                : user?.imageUrl || "https://www.gravatar.com/avatar/?d=mp&f=y"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Username */}
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">Username:</span>
          <span className="text-xl">{profileData?.username}</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">Email:</span>
          <span className="text-xl text-gray-500">{profileData?.email}</span>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Bio</h3>
          <p className="text-sm p-4 border rounded-xl shadow-md">
            {profileData?.description || "No bio available"}
          </p>
        </div>

        {/* Social Links */}
        <h3 className="text-lg font-semibold">Social Links</h3>
        <div className="p-4 border rounded-xl shadow-md">
          <ul className="flex flex-wrap gap-3">
            {profileData?.github && (
              <li>
                <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#333] text-white text-sm hover:bg-[#24292e] transition">
                  <FaGithub />
                  <span>GitHub</span>
                </a>
              </li>
            )}
            {profileData?.linkedin && (
              <li>
                <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0077b5] text-white text-sm hover:bg-[#005c91] transition">
                  <FaLinkedin />
                  <span>LinkedIn</span>
                </a>
              </li>
            )}
            {profileData?.twitter && (
              <li>
                <a href={profileData.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-sm hover:bg-neutral-800 transition">
                  <FaXTwitter />
                  <span>X</span>
                </a>
              </li>
            )}
            {profileData?.whatsapp && (
              <li>
                <a href={profileData.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-sm hover:bg-[#1ebc57] transition">
                  <FaWhatsapp />
                  <span>WhatsApp</span>
                </a>
              </li>
            )}
            {profileData?.instagram && (
              <li>
                <a href={profileData.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white text-sm hover:opacity-90 transition">
                  <FaInstagram />
                  <span>Instagram</span>
                </a>
              </li>
            )}
            {profileData?.facebook && (
              <li>
                <a href={profileData.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1877F2] text-white text-sm hover:bg-[#145dbf] transition">
                  <FaFacebook />
                  <span>Facebook</span>
                </a>
              </li>
            )}
            {profileData?.tiktok && (
              <li>
                <a href={profileData.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition">
                  <FaTiktok />
                  <span>TikTok</span>
                </a>
              </li>
            )}
            {profileData?.telegram && (
              <li>
                <a href={profileData.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0088cc] text-white text-sm hover:bg-[#0077b3] transition">
                  <FaTelegram />
                  <span>Telegram</span>
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Saved Posts */}
        <h2 className="text-xl font-semibold">Saved Posts</h2>
        <div className="p-4 border rounded-xl shadow-md">
          {profileData.savedPosts.map((post, index) => (
            <div
              key={index}
              className="p-4 border rounded-xl shadow-sm flex flex-col xl:flex-row gap-8 mb-6 transition"
            >
              {/* Image */}
              {post.img && (
                <Link to={`/${post.slug}`} className="md:hidden xl:block xl:w-1/3 hover:shadow-md transition rounded-2xl overflow-hidden cursor-pointer">
                  <img
                    src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}${post.img}`}
                    alt={post.title || "Post image"}
                    className="rounded-2xl object-cover w-full h-48"
                  />
                </Link>
              )}

              {/* Post Content */}
              <div className="flex flex-col gap-4 xl:w-2/3">
                <Link to={`/${post.slug}`} className="cursor-pointer">
                  <h3 className="text-2xl font-semibold hover:underline">{post.title || "Untitled"}</h3>
                </Link>

                <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500">
                  {post.category && (
                    <Link to={`/posts?cat=${post.category}`} className="text-[#e0e0e0] font-medium">
                      {post.category}
                    </Link>
                  )}
                  {post.user?.username && (
                    <>
                      <span>Written by</span>
                      <Link to={`/posts?author=${post.user.username}`} className="text-[#e0e0e0] font-medium">
                        {post.user.username}
                      </Link>
                    </>
                  )}
                  {post.createdAt && <span>{format(post.createdAt)}</span>}
                  {typeof post.visit === "number" && (
                    <div className="flex items-center gap-1 bg-[#e0e0e0] px-2 py-1 rounded-full text-xs font-semibold text-[#1b1c1c]">
                      <FaEye className="w-3 h-3 opacity-80" />
                      <span>{post.visit} views</span>
                    </div>
                  )}
                </div>

                <p className="text-sm line-clamp-3">
                  {post.desc || "No description available"}
                </p>

                <Link to={`/${post.slug}`} className="underline text-[#e0e0e0] font-bold text-sm cursor-pointer hover:text-white">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Button */}
        <button
          onClick={() => navigate("/profile/edit")}
          className="text-[#1b1c1c] bg-[#e0e0e0] p-2 rounded-md mt-4 w-36 mb-8"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

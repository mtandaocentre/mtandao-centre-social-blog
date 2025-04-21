import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaTelegram // Import the Telegram icon
} from "react-icons/fa6"; // from react-icons v6 for newer logos

const ProfilePage = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await res.json();
        setProfileData(data);
      } catch {
        // Optionally toast the error here
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
          {profileData?.imageUrl ? (
            <img
              src={profileData.imageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{profileData?.username?.charAt(0).toUpperCase() || "?"}</span>
          )}
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
          <h3 className="text-lg font-semibold">Bio:</h3>
          <p className="text-sm p-4 border rounded-xl shadow-md">
            {profileData?.description || "No bio available"}
          </p>
        </div>

        {/* Social Media Links */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Social Links</h2>
          <ul className="flex flex-wrap gap-3">
            {profileData?.github && (
              <li>
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#333] text-white text-sm hover:bg-[#24292e] transition"
                >
                  <FaGithub className="text-base" />
                  <span>GitHub</span>
                </a>
              </li>
            )}
            {profileData?.linkedin && (
              <li>
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0077b5] text-white text-sm hover:bg-[#005c91] transition"
                >
                  <FaLinkedin className="text-base" />
                  <span>LinkedIn</span>
                </a>
              </li>
            )}
            {profileData?.twitter && (
              <li>
                <a
                  href={profileData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-sm hover:bg-neutral-800 transition"
                >
                  <FaXTwitter className="text-base" />
                  <span>X</span>
                </a>
              </li>
            )}
            {profileData?.whatsapp && (
              <li>
                <a
                  href={profileData.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-sm hover:bg-[#1ebc57] transition"
                >
                  <FaWhatsapp className="text-base" />
                  <span>WhatsApp</span>
                </a>
              </li>
            )}
            {profileData?.instagram && (
              <li>
                <a
                  href={profileData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white text-sm hover:opacity-90 transition"
                >
                  <FaInstagram className="text-base" />
                  <span>Instagram</span>
                </a>
              </li>
            )}
            {profileData?.facebook && (
              <li>
                <a
                  href={profileData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1877F2] text-white text-sm hover:bg-[#145dbf] transition"
                >
                  <FaFacebook className="text-base" />
                  <span>Facebook</span>
                </a>
              </li>
            )}
            {profileData?.tiktok && (
              <li>
                <a
                  href={profileData.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition"
                >
                  <FaTiktok className="text-base" />
                  <span>TikTok</span>
                </a>
              </li>
            )}
            {profileData?.telegram && (
              <li>
                <a
                  href={profileData.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0088cc] text-white text-sm hover:bg-[#0077b3] transition"
                >
                  <FaTelegram className="text-base" />
                  <span>Telegram</span>
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Saved Posts Preview */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Saved Posts</h2>
          <div className="flex flex-col gap-4">
            {profileData?.savedPosts?.length > 0 ? (
              profileData.savedPosts.map((post, index) => (
                <div key={index} className="p-4 border rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold">{post.title || "Untitled"}</h3>
                  <p className="text-sm">{post.desc || "No description"}</p>
                </div>
              ))
            ) : (
              <p>No saved posts yet.</p>
            )}
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => navigate("/profile/edit")}
          className="text-white bg-blue-500 p-2 rounded-md mt-4 w-36 mb-8"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

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

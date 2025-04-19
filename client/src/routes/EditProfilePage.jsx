import { useEffect, useState, useMemo } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const EditProfilePage = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [mongoUserId, setMongoUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [saving, setSaving] = useState(false);

  const maxWords = 50;

  const wordCount = useMemo(() => {
    return bio.trim().split(/\s+/).filter(Boolean).length;
  }, [bio]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setMongoUserId(data._id);
        setUsername(data.username || "");
        setEmail(data.email || user.primaryEmailAddress.emailAddress || "");
        setBio(data.description || "");
      } catch {
        toast.error("Failed to load profile info.");
      }
    };

    if (isLoaded) {
      fetchProfile();
    }
  }, [isLoaded, getToken, user]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("description", bio);
      if (profilePic) formData.append("image", profilePic);

      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${mongoUserId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch {
      toast.error("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6 p-4">
      <h1 className="text-xl font-light">Edit Profile</h1>
      <form onSubmit={handleSaveChanges} className="flex flex-col gap-6 flex-1 mb-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <label htmlFor="profilePic" className="text-lg font-semibold">Profile Picture:</label>
          <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-[#1b1c1c] text-[#e0e0e0] text-3xl font-semibold shadow-md">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{username?.charAt(0).toUpperCase() || "?"}</span>
            )}
          </div>
          <Upload type="image" setData={setProfilePic}>
            Change Profile Picture
          </Upload>
        </div>

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-lg font-semibold">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md"
            required
          />
        </div>

        {/* Email (readonly) */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-lg font-semibold">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            readOnly
            className="p-2 rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <label htmlFor="bio" className="text-lg font-semibold">Bio:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={handleBioChange}
            className={`p-4 rounded-xl shadow-md ${
              wordCount > maxWords ? "bg-red-100 text-red-800" : "bg-[#f5f5f5] text-[#333333]"
            }`}
          />
          <small className={`mt-1 ${wordCount > maxWords ? "text-red-600 font-semibold" : ""}`}>
            {wordCount} / {maxWords} words
            {wordCount > maxWords && " — Too many words!"}
          </small>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            type="submit"
            disabled={saving || wordCount > maxWords}
            className={`text-white p-2 rounded-md mt-4 w-36 shadow-md ${
              saving || wordCount > maxWords
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="text-gray-600 border p-2 rounded-md mt-4 w-36"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;

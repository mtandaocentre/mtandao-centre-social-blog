import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Upload from "../components/Upload"; // Assuming Upload component is implemented for handling file uploads

const EditProfilePage = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.description || "");
  const [, setProfilePic] = useState(user?.img || "");
  const [coverPic, setCoverPic] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  if (!isLoaded) return <div>Loading...</div>;

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("bio", bio);
      if (coverPic) formData.append("cover", coverPic);

      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully!");
      navigate("/profile"); // Redirect to profile page after saving changes
    } catch (error) {
      toast.error("Error updating profile.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Edit Profile</h1>
      <form onSubmit={handleSaveChanges} className="flex flex-col gap-6 flex-1 mb-6">
        
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <label htmlFor="profilePic" className="text-lg font-semibold">Profile Picture:</label>
          <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-[#1b1c1c] text-[#e0e0e0] text-3xl font-semibold shadow-md">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user?.username?.charAt(0).toUpperCase() || "?"}</span>
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

        {/* Email */}
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
            onChange={(e) => setBio(e.target.value)}
            maxLength={250} // Adjust this as needed for 50 words
            className="p-4 rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md"
          />
          <small>{bio.length} / 250 characters</small>
        </div>

        {/* Cover Picture */}
        <div className="flex flex-col gap-2">
          <label htmlFor="coverPic" className="text-lg font-semibold">Cover Picture:</label>
          <Upload type="image" setData={setCoverPic}>
            Change Cover Picture
          </Upload>
          {coverPic && (
            <img
              src={coverPic}
              alt="Cover Preview"
              className="w-40 h-40 object-cover rounded-xl shadow-md"
            />
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="text-white bg-blue-500 p-2 rounded-md mt-4 w-36 disabled:bg-[#cfcfcf] disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;

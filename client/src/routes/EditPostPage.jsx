import { useAuth, useUser } from "@clerk/clerk-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const EditPostPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { slug } = useParams(); // Change from 'id' to 'slug'
  const [value, setValue] = useState(null);
  const [cover, setCover] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [audio, setAudio] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { data: postData, isLoading: postLoading } = useQuery({
    queryKey: ["post", slug],  // Use slug here instead of id
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`); // Use slug in the API call
      return response.data;
    },
    enabled: !!slug,  // Ensure query is enabled when slug is available
  });  

  useEffect(() => {
    if (postData) {
      console.log(postData.content);
      const imageUrl = `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}${postData.img}`;
      setCover({ url: imageUrl, filePath: postData.img });
      setTitle(postData.title);
      setCategory(postData.category);
      setDesc(postData.desc);
  
      // Set the fetched content without fallback
      if (postData?.content) {
        setValue(postData.content);
      }
    }
  }, [postData]);  
    
  useEffect(() => {
    if (img?.url) {
      setValue((prev) => prev + `<p><img src="${img.url}" alt="content image"/></p>`);
    }
  }, [img]);

  useEffect(() => {
    if (video?.url) {
      setValue((prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`);
    }
  }, [video]);

  useEffect(() => {
    if (audio?.url) {
      setValue((prev) => prev + `<p><audio controls src="${audio.url}"></audio></p>`);
    }
  }, [audio]);

  const mutation = useMutation({
    mutationFn: async ({ data }) => {
        const token = await getToken();
        const updateResponse = await axios.put(`${import.meta.env.VITE_API_URL}/posts/${slug}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return updateResponse;
    },
    onSuccess: (updateResponse) => {
      toast.success("Your post has been updated successfully!");
      navigate(`/${updateResponse.data.slug}`);
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error(error);
    },
  });

  if (!isLoaded || postLoading) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Sign in to access this page.</div>;

  const handleSubmit = (e) => {
    e.preventDefault();

    const title = title.trim();
    const category = category.trim();
    const desc = desc.trim();
    const content = value.trim();

    const newErrors = {};
    if (!cover?.filePath) newErrors.cover = "Please upload a cover image.";
    if (!title) newErrors.title = "Title is required.";
    if (!category) newErrors.category = "Category is required.";
    if (!desc) newErrors.desc = "Description is required.";
    if (!content) newErrors.content = "Content cannot be empty.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const data = {
      img: cover.filePath,
      title,
      category,
      desc,
      content,
    };

    mutation.mutate({ data });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ color: [] }, { background: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ list: "ordered" }, { list: "bullet" }, { script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["link", "image", "video"],
      [{ "code-block": true }],
      ["clean"]
    ],
  };

  const formats = [
    "header", "font", "size", "bold", "italic", "underline", "strike",
    "blockquote", "list", "bullet", "indent", "link", "image", "color",
    "code-block", "video", "audio", "script"
  ];

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Edit Your Article</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">

        {/* Cover Image */}
        <Upload type="image" setData={setCover}>
          <button className="w-max p-2 shadow-md rounded-xl text-sm text-[#1b1c1c] bg-[#a3a3a3]">
            Change Cover Image
          </button>
        </Upload>
        {errors.cover && <span className="text-red-500 text-sm">{errors.cover}</span>}

        {cover?.url && (
          <img
            src={cover.url}
            alt="Cover Preview"
            className="w-40 h-auto object-contain rounded-xl shadow-md"
          />
        )}

        {/* Title */}
        <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-4xl font-semibold bg-transparent outline-none"
            type="text"
            placeholder="Edit the Title"
            name="title"
        />
        {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}

        {/* Category */}
        <div className="flex items-center gap-4">
          <label htmlFor="category" className="text-sm">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            name="category"
            id="category"
            className="p-2 rounded-xl bg-[#a3a3a3] text-[#1b1c1c] shadow-md"
          >
            <option value="">-- Select --</option>
            <option value="general">General</option>
            <option value="aiot">AIoT</option>
            <option value="cloud">Cloud</option>
            <option value="data">Data</option>
            <option value="hardware">Hardware</option>
            <option value="security">Security</option>
            <option value="software">Software</option>
            <option value="web">Web</option>
         </select>

        </div>
        {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}

        {/* Description */}
        <textarea 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            name="desc"
            placeholder="Edit your article description..."
            className="p-4 rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md"
        />
        {errors.desc && <span className="text-red-500 text-sm">{errors.desc}</span>}

        {/* Editor */}
        <div className="flex flex-col gap-2 flex-grow">
            {postLoading || value === null ? (
                <div>Loading Editor...</div>
            ) : (
                <ReactQuill
                    theme="snow"
                    className="rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md custom-quill"
                    value={value}
                    onChange={setValue}
                    modules={modules}
                    formats={formats}
                    readOnly={mutation.isPending}
                />
            )}
            {errors.content && <span className="text-red-500 text-sm">{errors.content}</span>}
        </div>

        {/* Uploads */}
        <div className="flex gap-4 flex-shrink-0">
            <Upload type="image" setData={setImg}>
                🌆
            </Upload>
            <Upload type="video" setData={setVideo}>
                ▶️
            </Upload>
            <Upload type="audio" setData={setAudio}>
                🎵
            </Upload>
        </div>

        {/* Submit */}
        <button
          disabled={mutation.isPending}
          className="text-[#1b1c1c] bg-[#a3a3a3] font-medium
            rounded-xl mt-2 p-2 w-36 mb-6 disabled:bg-[#cfcfcf]
            disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Saving..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;

import { useAuth, useUser } from "@clerk/clerk-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import Select from 'react-select';

// Categories constant moved outside component
const categories = [
  { value: 'ai', label: 'AI' },
  { value: 'ar', label: 'AR' },
  { value: 'audio', label: 'Audio' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'data', label: 'Data' },
  { value: 'e-learning', label: 'E-Learning' },
  { value: 'farmtech', label: 'FarmTech' },
  { value: 'filmtech', label: 'FilmTech' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'foodtech', label: 'FoodTech' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'graphics', label: 'Graphics' },
  { value: 'greentech', label: 'GreenTech' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'health', label: 'Health' },
  { value: 'history', label: 'History' },
  { value: 'iot', label: 'IoT' },
  { value: 'llm', label: 'LLM' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'music', label: 'Music' },
  { value: 'networks', label: 'Networks' },
  { value: 'programming', label: 'Programming' },
  { value: 'quantum', label: 'Quantum' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'software', label: 'Software' },
  { value: 'security', label: 'Security' },
  { value: 'telecoms', label: 'Telecoms' },
  { value: 'ui/ux', label: 'UI/UX' },
  { value: 'vr', label: 'VR' },
  { value: 'video', label: 'Video' },
  { value: 'web', label: 'Web' },
];

const EditPostPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [value, setValue] = useState(null);
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [video, setVideo] = useState("");
  const [audio, setAudio] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { data: postData, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (postError) {
      toast.error("Failed to load post data");
      console.error("Post loading error:", postError);
      navigate("/");
    }
  }, [postError, navigate]);

  useEffect(() => {
    if (postData) {
      setTitle(postData.title || "");
      setDesc(postData.desc || "");
      setValue(postData.content || "");
      
      if (postData.category) {
        const foundCategory = categories.find(cat => cat.value === postData.category);
        setSelectedCategory(foundCategory || null);
      }
      
      if (postData.img) {
        setCover({
          url: `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}${postData.img}`,
          filePath: postData.img
        });
      } else {
        setCover(null);
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
    mutationFn: async (postData) => {
      const token = await getToken();
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/posts/${slug}`,
        {
          title: postData.title,
          category: postData.category,
          desc: postData.desc,
          content: postData.content,
          img: postData.cover?.filePath || null
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );
      return response.data;
    },
    onMutate: async (newPostData) => {
      await queryClient.cancelQueries(['post', slug]);
      const previousPost = queryClient.getQueryData(['post', slug]);

      queryClient.setQueryData(['post', slug], (old) => ({
        ...old,
        title: newPostData.title,
        category: newPostData.category,
        desc: newPostData.desc,
        content: newPostData.content,
        img: newPostData.cover?.filePath || old.img
      }));

      setTitle(newPostData.title);
      setSelectedCategory(categories.find(cat => cat.value === newPostData.category) || null);
      setDesc(newPostData.desc);
      setValue(newPostData.content);
      
      if (newPostData.cover?.filePath) {
        setCover({
          url: `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}${newPostData.cover.filePath}?${Date.now()}`,
          filePath: newPostData.cover.filePath
        });
      } else {
        setCover(null);
      }

      return { previousPost };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['post', slug], context.previousPost);
      toast.error("Failed to update post!");
      console.error("Update error:", error);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['post', slug], data);
      toast.success("Post updated successfully!");
      navigate(`/${data.slug || slug}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mutation.isPending) return;

    const newErrors = {};
    if (title.trim() === "") newErrors.title = "Title cannot be empty.";
    if (!selectedCategory) newErrors.category = "Category cannot be empty.";
    if (desc.trim() === "") newErrors.desc = "Description cannot be empty.";
    if (!value || value.trim() === "") newErrors.content = "Content cannot be empty.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    mutation.mutate({ 
      title: title.trim(),
      category: selectedCategory.value,
      desc: desc.trim(),
      content: value.trim(),
      cover
    });
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

  if (!isLoaded || postLoading) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Sign in to access this page.</div>;
  if (postError) return <div>Error loading post. Please try again.</div>;

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Edit Your Article</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">

        {/* Cover Image */}
        <Upload 
          type="image" 
          setData={(newCover) => {
            setImageLoading(true);
            setCover(newCover);
          }}
        >
          <button 
            type="button"
            className="w-max p-2 shadow-md rounded-xl text-sm text-[#1b1c1c] bg-[#a3a3a3]"
          >
            Change Cover Image
          </button>
        </Upload>
        {errors.cover && <span className="text-red-500 text-sm">{errors.cover}</span>}

        {cover?.url && (
          <div className="w-full relative" style={{ maxWidth: '300px' }}>
            <img
              src={cover.url}
              alt="Cover Preview"
              className={`rounded-xl shadow-md ${imageLoading ? 'invisible' : 'visible'}`}
              style={{ 
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                toast.error("Failed to load cover image");
              }}
            />
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl"></div>
            )}
          </div>
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
          <Select
            value={selectedCategory}
            options={categories}
            placeholder="Select a category"
            className="w-56"
            menuPlacement="auto"
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            styles={{
              menu: (provided) => ({
                ...provided,
                maxHeight: '200px',
              }),
              control: (provided) => ({
                ...provided,
                backgroundColor: '#a3a3a3',
                border: 'none',
                borderRadius: '12px',
                padding: '2px 4px',
                minHeight: 'auto',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              }),
              placeholder: (provided) => ({
                ...provided,
                color: '#1b1c1c'
              }),
              valueContainer: (provided) => ({
                ...provided,
                padding: '0 6px',
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                padding: '4px 8px',
                color: '#1b1c1c',
                '&:hover': {
                  color: '#1b1c1c',
                },
              }),
              indicatorSeparator: (provided) => ({
                ...provided,
                display: 'block',
                backgroundColor: '#1b1c1c',
                width: '1px',
                margin: '4px 0',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? '#a3a3a3' : 'white',
                color: state.isSelected ? 'white' : '#1b1c1c',
              }),
            }}
            onChange={(selectedOption) => {
              setSelectedCategory(selectedOption);
            }}
          />
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
        <div className="flex flex-col gap-2 h-70">
          {postLoading || value === null ? (
            <div>Loading Editor...</div>
          ) : (
            <ReactQuill
              theme="snow"
              className="rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md h-full"
              value={value}
              onChange={setValue}
              modules={modules}
              formats={formats}
              readOnly={mutation.isPending}
            />
          )}
          {errors.content && <span className="text-red-500 text-sm">{errors.content}</span>}
        </div>

        {/* Upload buttons */}
        <div className="flex gap-4 flex-shrink-0 mt-8">
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

        {/* Submit & Cancel Buttons */}
        <div className="flex gap-4 mb-8 mt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className={`text-white p-2 rounded-md w-36 shadow-md ${
              mutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {mutation.isPending ? "Saving..." : "Update"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/${slug}`)}
            className="text-gray-600 border p-2 rounded-md w-36"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;
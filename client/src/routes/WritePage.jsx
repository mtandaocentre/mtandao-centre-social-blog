import { useAuth, useUser } from "@clerk/clerk-react"
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';
import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import Select from 'react-select';

const WritePage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [audio, setAudio] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    if (img?.url) {
      setValue(prev => prev + `<p><img src="${img.url}" alt="content image"/></p>`);
    }
  }, [img]);

  useEffect(() => {
    if (video?.url) {
      setValue(prev => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`);
    }
  }, [video]);

  useEffect(() => {
    if (audio?.url) {
      setValue(prev => prev + `<p><audio controls src="${audio.url}"></audio></p>`);
    }
  }, [audio]);
  
  const mutation = useMutation({
    mutationFn: async ({ data }) => {
      const token = await getToken();
      const postResponse = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return postResponse;
    },
    onSuccess: (postResponse) => {
      toast.success("Your post has been created successfully!");
      navigate(`/${postResponse.data.slug}`);
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error(error);
    },
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Sign in to access this page.</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title")?.trim();
    const desc = formData.get("desc")?.trim();
    const content = value?.trim();
  
    const newErrors = {};
    if (!cover?.filePath) newErrors.cover = "Please upload a cover image.";
    if (!title) newErrors.title = "Title is required.";
    if (!selectedCategory) newErrors.category = "Category is required.";
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
      category: selectedCategory.value, // Use the selected category's value
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
    ]
  };

  const formats = [
    "header", "font", "size", "bold", "italic", "underline", "strike",
    "blockquote", "list", "bullet", "indent", "link", "image", "color",
    "code-block", "video", "audio", "script"
  ];

  // In your component:
  const categories = [
    { value: 'ai', label: 'AI' },
    { value: 'ar', label: 'AR' },
    { value: 'audio', label: 'Audio' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'data', label: 'Data' },
    { value: 'e-learning', label: 'E-Leraning' },
    { value: 'farmtech', label: 'FarmTech' },
    { value: 'filmtech', label: 'FilmTech' },
    { value: 'fintech', label: 'fintech' },
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
    { value: 'Telecoms', label: 'Telecoms' },
    { value: 'ui/ux', label: 'UI/UX' },
    { value: 'vr', label: 'vr' },
    { value: 'video', label: 'video' },
    { value: 'web', label: 'Web' },
  ];

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Create a New Article</h1>
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
            Add a cover image
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
          className="text-4xl font-semibold bg-transparent outline-none" 
          type="text" 
          placeholder="Your Post Title"
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
                padding: '4px 8px', // Added more horizontal padding
                color: '#1b1c1c',
                '&:hover': {
                  color: '#1b1c1c',
                },
              }),
              indicatorSeparator: (provided) => ({
                ...provided,
                display: 'block', // Changed from 'none' to 'block'
                backgroundColor: '#1b1c1c',
                width: '1px',
                margin: '4px 0', // Adjust vertical spacing
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
          name="desc" 
          placeholder="Add a short description about your article..."
          className="p-4 rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md"
        />
        {errors.desc && <span className="text-red-500 text-sm">{errors.desc}</span>}

        {/* Editor */}
        <div className="flex flex-col gap-2 h-70 mb-4 relative">
          <ReactQuill 
            theme="snow" 
            className="custom-quill rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md h-full"
            value={value || ''}
            onChange={setValue}
            modules={modules}
            formats={formats}
            placeholder="Write your article here..."
            readOnly={mutation.isPending}
          />
          {errors.content && (
            <span className="text-red-500 text-sm">{errors.content}</span>
          )}
        </div>

        {/* Uploads - Increased top margin */}
        <div className="flex gap-4 flex-shrink-0 mt-4"> {/* Changed from mt-4 to mt-8 */}
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

        {/* Submit Button */}
        <div className="flex gap-4 mb-8 mt-4"> {/* Changed from mt-4 to mt-8 */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className={`text-white p-2 rounded-md w-36 shadow-md ${
              mutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {mutation.isPending ? "Loading..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePage;
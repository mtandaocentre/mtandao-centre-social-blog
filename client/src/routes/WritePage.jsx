import { useAuth, useUser } from "@clerk/clerk-react"
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';
import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const WritePage = () => {

  // Check is user is authenticated
  const {isLoaded, isSignedIn} =useUser();

  // Create use state for geting content
  const [value, setValue] = useState("");

  // Create use state for geting cover image
  const [cover, setCover] = useState("");

  // Create use state for geting content image
  const [img, setImg] = useState("");

  // Create use state for geting content video
  const [video, setVideo] = useState("");

  // Create use state for progress
  const [progress, setProgress] = useState(0);

  // Create useEffect for adding image
  useEffect(() => {
    img && setValue(prev => prev + `<p><image src="${img.url}"/></p>`)
  },[img])

  // Append inserted images/videos to the editor content
  useEffect(() => {
  if (img && img.url) {
    setValue(prev => prev + `<p><img src="${img.url}" alt="content image"/></p>`);
  }
  }, [img]);

  // Create useEffect for adding video
  useEffect(() => {
  video && setValue(prev => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`)
  },[video])

  // Use navigate hook
  const navigate = useNavigate();

  // Get token 
  const { getToken } = useAuth();

  // Combined mutation for creating the post and updating user description
  const mutation = useMutation({
    mutationFn: async ({ data, authorDescription }) => {
      const token = await getToken();
      const [postResponse, userDescResponse] = await Promise.all([
        axios.post(`${import.meta.env.VITE_API_URL}/posts`, data, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.patch(
          `${import.meta.env.VITE_API_URL}/users/description`,
          { description: authorDescription },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);
      return { postResponse, userDescResponse };
    },
    onSuccess: ({ postResponse }) => {
      toast.success("Your post has been created successfully!");
      navigate(`/${postResponse.data.slug}`);
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error(error);
    },
  });

  if(!isLoaded){
    return <div className="">Loading...</div>
  }

  if(isLoaded && !isSignedIn){
    return <div className="">SignIn to Access this page.</div>
  }

  // handle submit function
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };

    // console.log(data);

    const authorDescription = formData.get("authorDescription");

    // Instead of calling mutation.mutate(data) directly, pass an object with both pieces of data
    mutation.mutate({ data, authorDescription });

  };

  //Custom tool bar react-quill
  const modules = {
    toolbar: [
      [{ header: [1,2,3,4,5,6,false] }],
      [{"font": []}],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{"color": []}, {"background": []}],
      [{"size": ["small", false, "large", "huge"]}],
      [{list: "ordered"}, {list: "bullet"}, {"script": "sub"}, {"script": "super"}],
      [{"indent": "-1"}, {"indent": "+1"}, {"align": []}],
      ["link", "image", "video"],
      [{"code-block": true}],
      ["clean"]
    ]
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block",
    "video",
    "script"
  ]

  return (
    // Style root container
    <div 
      className='h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex
      flex-col gap-6'
    >
      {/* Create page title */}
      {/* Style page title */}
      <h1 className="text-xl font-light">Create a New Post</h1>

      {/* Create form */}
      {/* Style form container */}
      {/* Change actions to classname */}
      {/* Fetch data from form  */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">

        {/* Call upload component */}
        <Upload type="image" setProgress={setProgress} setData={(data) => {
          console.log("Cover upload response:", data);
          setCover(data);
        }}>
          {/* Add button for adding cover image */}
          {/* Style button */}
          <button 
            className="w-max p-2 shadow-md rounded-xl text-sm text-[#1b1c1c]
            bg-[#a3a3a3]"
          >
            Add a cover image
          </button> 
        </Upload> 

        {/* Cover image preview */}
        {cover?.url && (
          <img
            src={cover.url}
            alt="Cover Preview"
            className="w-40 h-auto object-contain rounded-xl shadow-md"
          />
        )}

        {/* Add title */}
        <input 
          className="text-4xl font-semibold bg-transparent 
          outline-none" 
          type="text" 
          placeholder="My Tech Idea/Story" 
          name="title"
        />

        {/* Create choose category section */}
        {/* Style choose category section */}
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">Choose a category:</label>
          <select 
            name="category" 
            id="" 
            className="p-2 rounded-xl bg-[#a3a3a3] text-[#1b1c1c] 
            shadow-md"
          >
            <option value="general">General</option>
            <option value="ai">AIoT</option>
            <option value="cloud">Cloud</option>
            <option value="data">Data</option>
            <option value="hardware">Hardware</option>
            <option value="security">Security</option>
            <option value="software">Software</option>
            <option value="web2">Web</option>
          </select>
        </div>

        {/* Add description text area */}
        {/* Style description text area */}
        <textarea 
          name="desc" 
          placeholder="Add a short description about the article you are writting..."
          className="p-4 rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md" 
        />

        {/* Add photo and video emoji */}
        <div className="flex flex-1">

          <div className="flex flex-col gap-2 mr-2 ">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆
            </Upload> 
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              ▶️
            </Upload> 
          </div>

          {/* Use react Quill to create write page content text area */}
          {/* Style quill */}
          <ReactQuill 
            theme="snow" 
            className="flex-1 h-[500px] rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md"
            value={value} 
            onChange={setValue}
            modules = {modules}
            formats = {formats}
            readOnly={0 < progress && progress < 100}
          />

        </div>

         {/* New field for author description */}
         <textarea
          name="authorDescription"
          placeholder="Add a short description about the author of the article..."
          className="p-4 rounded-xl bg-[#e0e0e0] text-[#1b1c1c] shadow-md"
        />

        {/* Add send button */}
        {/* Style send button */}
        {/* Use mutation on button */}
        <button 
          disabled = {mutation.isPending || (0 < progress && progress < 100)}
          className="text-[#1b1c1c] bg-[#a3a3a3] font-medium
          rounded-xl mt-4 p-2 w-36 disabled:bg-[#cfcfcf]
          disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Loading..." : "Send"}
        </button>
        {/* progress button */}
        {"Progress:" + progress}
        {/* { mutation.isError && <span>{mutation.error.message}</span> } */}
      </form>


    </div>
  )
}

export default WritePage
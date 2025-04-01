import Image from "../components/Image";
import { Link, useParams } from "react-router-dom";
import PostMenuAction from "../components/PostMenuAction";
import Search from "../components/Search";
import Comments from "../components/Comments";
import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "timeago.js";
import parse from "html-react-parser";
import { FaEye, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

// Transformation function to fix code blocks
const transformCodeBlocks = (html) => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const containers = doc.querySelectorAll(".ql-code-block-container");
  containers.forEach((container) => {
    const codeLines = container.querySelectorAll(".ql-code-block");
    let codeText = "";
    codeLines.forEach((line) => {
      codeText += line.textContent + "\n";
    });
    const pre = doc.createElement("pre");
    const code = doc.createElement("code");
    code.textContent = codeText.trim();
    pre.appendChild(code);
    container.parentNode.replaceChild(pre, container);
  });
  return doc.body.innerHTML;
};

const fetchPosts = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPosts(slug),
  });
  
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // When data is fetched, update local state.
  useEffect(() => {
    if (data?.likes) {
      setLikes(data.likes.length);
      // data.likes is an array of strings now.
      setHasLiked(user?.id ? data.likes.includes(user.id) : false);
    }
  }, [data, user]);

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to like a post.");
      return;
    }
    if (!user?.id || !data?._id) {
      console.error("Missing userId or postId", { userId: user?.id, postId: data?._id });
      return;
    }

    // Save current state for rollback.
    const previousLikes = likes;
    const previousHasLiked = hasLiked;

    // Optimistically update local state.
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
    setIsLiking(true);

    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${data._id}/like`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Manually update the cache.
      queryClient.setQueryData(["post", slug], (oldData) => {
        if (!oldData) return oldData;
        let updatedLikes;
        // Since likes is an array of strings:
        if (!previousHasLiked) {
          // Add current user's ID if not already present.
          if (!oldData.likes.includes(user.id)) {
            updatedLikes = [...oldData.likes, user.id];
          } else {
            updatedLikes = oldData.likes;
          }
        } else {
          // Remove current user's ID.
          updatedLikes = oldData.likes.filter((id) => id !== user.id);
        }
        return { ...oldData, likes: updatedLikes };
      });
      // (Optional) Invalidate queries if needed.
      // queryClient.invalidateQueries(["post", slug]);
    } catch (error) {
      console.error("Error liking post:", error.response?.data || error.message);
      // Roll back optimistic update on error.
      setLikes(previousLikes);
      setHasLiked(previousHasLiked);
    } finally {
      setIsLiking(false);
    }
  };

  if (isPending) return "Loading...";
  if (error) return "Something went wrong! " + error.message;
  if (!data) return "Post not found!";

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-bold">{data.title}</h1>
          <div className="flex items-center gap-2 text-[#e0e0e0] text-sm">
            <span>Written by</span>
            <Link className="text-[#e0e0e0] font-semibold">{data.user.username}</Link>
            <span>on</span>
            <Link className="text-[#e0e0e0] font-semibold">{data.category}</Link>
            <span>{format(data.createdAt)}</span>
            <div className="flex items-center gap-1 bg-[#e0e0e0] px-3 py-1 rounded-full text-sm font-semibold text-[#1b1c1c]">
              <FaEye className="w-4 h-4 opacity-80" />
              <span>{data.visit} views</span>
            </div>
          </div>
          <p className="text-[#e0e0e0] font-medium w-full max-w">{data.desc}</p>
        </div>

        {data.img && (
          <div className="hidden lg:block w-full max-w-[400px] ml-16">
            <Image src={data.img} className="rounded-2xl w-full" />
          </div>
        )}
      </div>

      {/* Content and Sidebar */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Content Area (75% on md+) */}
        <div className="lg:text-lg flex flex-col gap-6 text-justify w-full md:w-3/5">
          {parse(transformCodeBlocks(data.content))}
        </div>
        {/* Sidebar (25% on md+) */}
        <div className="px-4 h-max sticky top-8 w-full md:w-1/4">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-8">
              {data.user.img && (
                <Image
                  src={data.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />
              )}
              <Link className="font-bold">{data.user.username}</Link>
            </div>
            <p className="text-sm font-medium">{data.user.description || "No description available."}</p>
            <div className="flex gap-2">
              <Link><Image src="facebook.svg" /></Link>
              <Link><Image src="instagram.svg" /></Link>
            </div>
          </div>
          <PostMenuAction post={data} />
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline">All Posts</Link>
            <Link className="underline">AI</Link>
            <Link className="underline">Cloud</Link>
            <Link className="underline">Data</Link>
            <Link className="underline">Hardware</Link>
            <Link className="underline">IoT</Link>
            <Link className="underline">Security</Link>
            <Link className="underline">Software</Link>
            <Link className="underline">Web3</Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      
      {/* Like Button */}
      <button
        onClick={handleLike}
        className="inline-flex items-center gap-2 bg-[#e0e0e0] px-3 py-1 rounded-full text-sm font-semibold text-[#1b1c1c] transition duration-200 hover:bg-gray-300 max-w-fit"
        disabled={isLiking}
      >
        <motion.div
          animate={{ scale: hasLiked ? 1.3 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <FaHeart
            className="w-4 h-4 opacity-80"
            style={{ color: hasLiked ? "red" : "#1b1c1c" }}
          />
        </motion.div>
        <span>{likes}</span>
      </button>

      {/* Comments */}
      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePostPage;
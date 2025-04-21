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
import { motion } from "framer-motion";
// FA6 imports (Font Awesome 6)
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
// FA5 icons (not available in fa6)
import {
  FaEye,
  FaHeart,
  FaShareAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaCopy,
} from "react-icons/fa";


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

  // Track share count
  const [shares, setShares] = useState(data?.shareCount || 0); 
  // Add this state to control the share options menu:
  const [showShareOptions, setShowShareOptions] = useState(false);

  // When data is fetched, update local state.
  useEffect(() => {
    if (data?.likes) {
      setLikes(data.likes.length);
      // data.likes is an array of strings now.
      setHasLiked(user?.id ? data.likes.includes(user.id) : false);
    }
  }, [data, user]);

  // Update share count when data changes.
  useEffect(() => {
    if (data) {
      setShares(data.shareCount);
    }
  }, [data]);

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

  const handleShare = async () => {
    // Only allow sharing if the user is logged in
    if (!user) {
      alert("You must be logged in to share a post.");
      return;
    }
  
    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${data._id}/increment-share`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update the UI share count after successful share
      setShares((prev) => prev + 1);
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  
    // Toggle the share options menu for logged-in users
    setShowShareOptions(!showShareOptions);
  };

  // Helper function to copy the link:
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
    // Hide the share options menu after copying link
    setShowShareOptions(false);
  };
  
  // Helper function to open the share URL:
  const shareOnSocialMedia = (platform) => {
    const postUrl = encodeURIComponent(window.location.href);
    const postTitle = encodeURIComponent(data.title);
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${postTitle}%20${postUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${postUrl}&text=${postTitle}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    // Hide the share options menu after selecting a platform
    setShowShareOptions(false);
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
            <Link className="text-[#e0e0e0] font-semibold">{data.category}</Link>
            <span>Written by</span>
            <Link className="text-[#e0e0e0] font-semibold">{data.user.username}</Link>
            <span>on</span>
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
          
          {/* Author */}
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
            
            {/*Social media links*/}
            <div className="flex gap-2">
              {data.user.github && (
                <a href={data.user.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub className="text-xl text-[#333] hover:opacity-80 transition" />
                </a>
              )}
              {data.user.linkedin && (
                <a href={data.user.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="text-xl text-[#0077B5] hover:opacity-80 transition" />
                </a>
              )}
              {data.user.twitter && (
                <a href={data.user.twitter} target="_blank" rel="noopener noreferrer">
                  <FaXTwitter className="text-xl text-black hover:opacity-80 transition" />
                </a>
              )}
              {data.user.whatsapp && (
                <a href={data.user.whatsapp} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="text-xl text-[#25D366] hover:opacity-80 transition" />
                </a>
              )}
              {data.user.instagram && (
                <a href={data.user.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-xl text-[#E1306C] hover:opacity-80 transition" />
                </a>
              )}
              {data.user.facebook && (
                <a href={data.user.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="text-xl text-[#1877F2] hover:opacity-80 transition" />
                </a>
              )}
              {data.user.tiktok && (
                <a href={data.user.tiktok} target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="text-xl text-black hover:opacity-80 transition" />
                </a>
              )}
              {data.user.telegram && (
                <a href={data.user.telegram} target="_blank" rel="noopener noreferrer">
                  <FaTelegram className="text-xl text-[#0088cc] hover:opacity-80 transition" />
                </a>
              )}
            </div>

          </div>
          
          <PostMenuAction post={data} />
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline" to="/posts">All Posts</Link>
            <Link className="underline" to="/posts?cat=aiot">AIoT</Link>
            <Link className="underline" to="/posts?cat=cloud">Cloud</Link>
            <Link className="underline" to="/posts?cat=data">Data</Link>
            <Link className="underline" to="/posts?cat=general">General</Link>
            <Link className="underline" to="/posts?cat=hardware">Hardware</Link>
            <Link className="underline" to="/posts?cat=security">Security</Link>
            <Link className="underline" to="/posts?cat=software">Software</Link>
            <Link className="underline" to="/posts?cat=web">Web</Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      
      {/* Like & Share Button Container */}
      <div className="flex justify-between items-center mt-6 w-full md:w-3/5">
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

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 bg-blue-500 px-3 py-1 rounded-full text-white text-sm font-semibold shadow-lg hover:bg-blue-600 transition duration-200"
        >
          <FaShareAlt className="w-4 h-4" />
          <span>{shares}</span>
        </button>
      </div>

      {/* Social Media Share Options Menu */}
      {showShareOptions && (
        <div className="flex flex-wrap gap-2 mt-4 w-full md:w-3/5">
          <button
            onClick={() => shareOnSocialMedia("facebook")}
            className="inline-flex items-center gap-2 bg-[#1877f2] px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg hover:bg-[#145db2] transition duration-200"
          >
            <FaFacebookF className="w-4 h-4" />
            <span>Facebook</span>
          </button>
          <button
            onClick={() => shareOnSocialMedia("x")}
            className="inline-flex items-center gap-2 bg-black px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg hover:bg-neutral-800 transition duration-200"
          >
            <FaTwitter className="w-4 h-4" />
            <span>X</span>
          </button>
          <button
            onClick={() => shareOnSocialMedia("linkedin")}
            className="inline-flex items-center gap-2 bg-[#0077b5] px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg hover:bg-[#005582] transition duration-200"
          >
            <FaLinkedinIn className="w-4 h-4" />
            <span>LinkedIn</span>
          </button>
          <button
            onClick={() => shareOnSocialMedia("whatsapp")}
            className="inline-flex items-center gap-2 bg-[#25d366] px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg hover:bg-[#1da851] transition duration-200"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => shareOnSocialMedia("telegram")}
            className="inline-flex items-center gap-2 bg-[#0088cc] px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg hover:bg-[#006C8B] transition duration-200"
          >
            <FaTelegram className="w-4 h-4" />
            <span>Telegram</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg hover:bg-gray-700 transition duration-200"
          >
            <FaCopy className="w-4 h-4" />
            <span>Copy Link</span>
          </button>
        </div>
      )}

      {/* Comments */}
      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePostPage;
import axios from "axios";
import Image from "./Image"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

const fetchPosts = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`
  );
  return res.data;
};

const FeaturedPosts = () => {

  const { isPending, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: () => fetchPosts(),
  });

  if (isPending) return "Loading...";
  if (error) return "Something went wrong! " + error.message;

  const posts = data.posts
  if (!posts || posts.length === 0) {
    return
  }

  return (
    /* Add responsiveness */
    <div className='mt-8 flex flex-col lg:flex-row gap-8'>
      {/* - Divide featured post into two sections
          - Add w-full and h-full to all images to contain them in 
            their containers 
      */}
        
      {/* Fisrt post */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
      
        {/* Image */}
        {/* - Add and style image component 
            - Rename image src
            - Adjust image width for firts post
        */}
        {posts[0].img && (
          <div className="w-full overflow-hidden rounded-3xl aspect-[16/9]">
            <Image 
              src={posts[0].img}
              className="object-cover w-full h-full"
              w="895"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 overflow-hidden">
          {/* Details */}
          <div className="flex items-center gap-4">
            <h1 className="font-bold lg:text-lg">01.</h1>
            <Link className="font-semibold text-[#e0e0e0] lg:text-lg">{posts[0].category}</Link>
            <span className="text-[#e0e0e0] font-medium">{format(posts[0].createdAt)}</span>
          </div>

          {/* Title */}
          <Link to={posts[0].slug}
            className="text-lg lg:text-2xl font-semibold lg:font-bold"
          >
            {posts[0].title}
          </Link>

          {/* 2-Line Clamped Description */}
          <p className="text-[#c0c0c0] text-sm lg:text-base leading-relaxed line-clamp-2">
            {posts[0].desc}
          </p>
        </div>

      </div>

      {/* Other posts */}
      {/* - Add and style other featured posts 
          - Adjusted image width for other posts
      */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4 h-auto lg:h-full overflow-hidden">
        
        {/* Second */}
        {posts[1] && <div className="flex gap-4">
          <div className="w-1/3">
            <div className="relative w-full h-full min-h-[120px]">
              <Image 
                src={posts[1].img}
                className="rounded-3xl object-cover w-full h-full absolute inset-0"
                w="298"
              />
            </div>
          </div>

          <div className="w-2/3 flex flex-col justify-between">
            <div className="flex items-center gap-4 text-sm lg:text-base mb-2">
              <h1 className="font-bold">02.</h1>
              <Link className="text-[#e0e0e0] font-semibold">{posts[1].category}</Link>
              <span className="text-[#e0e0e0] text-sm font-medium">{format(posts[1].createdAt)}</span>
            </div>
            <Link to={posts[1].slug}
              className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
            >
              {posts[1].title}
            </Link>
            {posts[1].desc && (
              <p className="text-[#c0c0c0] text-sm mt-1 line-clamp-2">
                {posts[1].desc}
              </p>
            )}
          </div>
        </div>}

        {/* Third */}
        {posts[2] && <div className="flex gap-4">
          <div className="w-1/3">
            <div className="relative w-full h-full min-h-[120px]">
              <Image 
                src={posts[2].img}
                className="rounded-3xl object-cover w-full h-full absolute inset-0"
                w="298"
              />
            </div>
          </div>

          <div className="w-2/3 flex flex-col justify-between">
            <div className="flex items-center gap-4 text-sm lg:text-base mb-2">
              <h1 className="font-bold">03.</h1>
              <Link className="text-[#e0e0e0] font-semibold">{posts[2].category}</Link>
              <span className="text-[#e0e0e0] text-sm font-medium">{format(posts[2].createdAt)}</span>
            </div>
            <Link to={posts[2].slug}
              className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
            >
              {posts[2].title}
            </Link>
            {posts[2].desc && (
              <p className="text-[#c0c0c0] text-sm mt-1 line-clamp-2">
                {posts[2].desc}
              </p>
            )}
          </div>
        </div>}

        {/* Fourth */}
        {posts[3] && <div className="flex gap-4">
          <div className="w-1/3">
            <div className="relative w-full h-full min-h-[120px]">
              <Image 
                src={posts[3].img}
                className="rounded-3xl object-cover w-full h-full absolute inset-0"
                w="298"
              />
            </div>
          </div>

          <div className="w-2/3 flex flex-col justify-between">
            <div className="flex items-center gap-4 text-sm lg:text-base mb-2">
              <h1 className="font-bold">04.</h1>
              <Link className="text-[#e0e0e0] font-semibold">{posts[3].category}</Link>
              <span className="text-[#e0e0e0] text-sm font-medium">{format(posts[3].createdAt)}</span>
            </div>
            <Link to={posts[1].slug}
              className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
            >
              {posts[3].title}
            </Link>
            {posts[3].desc && (
              <p className="text-[#c0c0c0] text-sm mt-1 line-clamp-2">
                {posts[3].desc}
              </p>
            )}
          </div>
        </div>}

      </div>

    </div>
  )
}

export default FeaturedPosts
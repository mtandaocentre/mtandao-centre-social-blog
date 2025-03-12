import Image from "../components/Image";
import { Link, useParams } from "react-router-dom";
import PostMenuAction from "../components/PostMenuAction";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import parse from "html-react-parser"

const fetchPosts = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {

  const {slug} = useParams();

  const { isPending, error, data } = useQuery({
      queryKey: ["posts", slug],
      queryFn: () => fetchPosts(slug),
  });

  if (isPending) return "Loading..."
  if (error) return "Something went wrong!" + error.message
  if (!data) return "Post not found!"

  return (
    /* Style single post page container */
    <div className='flex flex-col gap-8'>
      {/* Heading */}
      <div className="flex gap-8">
        
        {/* Title and Details */}
        {/* Style title and detail container */}
        <div className="lg:w-3/5 flex flex-col gap-8">
          
          {/* - Add title
              - Style title 
          */}
          <h1 
            className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-bold"
          >
            {data.title}
          </h1>

          {/* - Add details container
              - Style details links 
          */}
          <div className="flex items-center gap-2 text-[#e0e0e0] text-sm">
            <span>Written by</span>
            <Link className="text-[#e0e0e0] font-semibold">{data.user.username}</Link>
            <span>on</span>
            <Link className="text-[#e0e0e0] font-semibold">{data.category}</Link>
            <span>{format(data.createdAt)}</span>
          </div>

          {/* - Add and style description 
              - made description short */}
          <p className="text-[#e0e0e0] font-medium">
            {data.desc}
          </p>

        </div>

        {/* Image */}
        {/* - Add and style Image component
            - Add width and rounding to image
        */}
        {data.img && <div className="hidden lg:block w-2/5">
          <Image 
            src={data.img}
            w="600" 
            className="rounded-2xl" 
          />
        </div>}

      </div>

      {/* Content */}
      {/* - Style content container 
          - Changed content container gap
      */}
      <div className="flex flex-col md:flex-row gap-12">

        {/* Text */}
        {/* Add and style content text */}
        <div className="lg:text-lg flex flex-col gap-6 text-justify">
            {parse(data.content)}
        </div>

        {/* Menu */}
        {/* Add and style menu container */}
        <div className="px-4 h-max sticky top-8">
          {/* - Add Author title 
              - style Authors title
          */}
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          
          {/* Style Author section */}
          <div className="flex flex-col gap-4">
              {/* - Add and style image 
              - Style image author name and description */}
              <div className="flex items-center gap-8">
                {data.user.img && <Image 
                  src={data.user.img} 
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />}
                {/* - Add user name and description 
                    - Styled Authosr name 
                */}
                <Link className="font-bold">{data.user.username}</Link>
              </div>

              {/* - Description 
                  - Style description */}
              <p className="text-sm font-medium">
                  Lorem Ipsum is simply dummy text of the printing and 
                  typesetting industry.  Lorem Ipsum is simply dummy text of the printing and 
                  typesetting industry. 
              </p>

              {/* Add social media links */}
              <div className="flex gap-2">
                <Link>
                  <Image src="facebook.svg"/>
                </Link>
                <Link>
                  <Image src="instagram.svg"/>
                </Link>
              </div>
          </div>
         
         {/* - Add post menu action component 
             - Change position of PostMenuAction component 
         */}
          <PostMenuAction post={data}/>

          {/* - Add categories title
              - Style categories heading
          */}
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>

          {/* Add categories links */}
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

          {/* - Add search heading 
              - Style search heading
          */}
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>

          {/* Add Search component */}
          <Search />
        </div>
      </div>
      {/* Comments*/}
      {/* Add comments component */}
      <Comments postId={data._id}/>
    </div>
  )
}

export default SinglePostPage
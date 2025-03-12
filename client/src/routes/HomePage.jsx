import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

const HomePage = () => {
  return (
    /* Style home page */
    <div className='mt-4 flex flex-col gap-4'>
      
      {/* BREADCRUMB */}
      {/* Create and style Breadcrumb secrion */}
      <div className="flex gap-4 text-[#e0e0e0]">
        <Link to="/" className="font-bold">Home</Link>
        <span>•</span>
        <span>Blogs and Articles</span>
      </div>

      {/* INTRODUCTION */}
      {/* Create and style introduction section */}
      <div className="flex items-centre justify-between">
        
        {/* titles */}
        {/* Create and style titles section */}
        <div>
          <h1 
            className="text-[#e0e0e0] text-2xl md:text-5xl
            lg:text-6xl font-bold"
          >
            Your Online Place for Everything Computers.
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Your Online Place for Everything Computers.
          </p>
        </div>

        {/* Animated Button */}
        {/* - Create and style animation button
            - Create responsiveness for the write button 
        */}
        <Link to="write" className="hidden md:block relative">

        {/* SVG on which text will seat on */}
        <svg
          viewBox="0 0 200 200"
          width="200"
          height="200"
          // Add animation
          className="text-lg tracking-widest animate-spin animatedButton"
        >
          <path
            id="circlePath"
            fill="none"
            d="M 100, 100 m -75, 0 a 75, 75 0 1, 1 150, 
            0 a 75, 75 0 1, 1 -150, 0" 
          />

          {/* Text to be animated */}
          <text>
            <textPath 
              href="#circlePath" fill="#e0e0e0" startOffset="0%"
            >
              Write your Story •
            </textPath>

            <textPath 
              href="#circlePath" fill="#e0e0e0" startOffset="50%"
            >
              Share your idea •
            </textPath>
          </text>
        </svg>

        {/* Button with arrow*/}
        <button 
          className="absolute top-0 left-0 right-0 m-auto bottom-0 
          w-20 h-20 bg-[#e0e0e0] rounded-full flex items-center 
          justify-center"
        >
          {/* Arrow SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="50"
            height="50"
            fill="none"
            stroke="#1b1c1c"
            strokeWidth="2"
          >
            <line x1="6" y1="18" x2="18" y2="6" />
            <polyline points="9 6 18 6 18 15" />
          </svg>
        </button>
        </Link>
      </div>

      {/* CATEGORIES */}
      {/* Add main categories component to home page */}
      <MainCategories />

      {/* FEATURED POSTS */}
      {/* Add featured posts to home page */}
      <FeaturedPosts />
      
      {/* POST LIST */}
      {/* - Add recent posts title
          - Add PostList component to home page
      */}
      <div className="">
        <h1 
          className="my-8 text-2xl text-[#e0e0e0]"
        >
          Recent Posts
        </h1>
        <PostList />
      </div>
    </div>
  )
}

export default HomePage
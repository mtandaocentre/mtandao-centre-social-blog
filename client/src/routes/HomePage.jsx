import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import Search from "../components/Search";

const HomePage = () => {
  return (
    <div className='mt-4 flex flex-col gap-4 px-4 sm:px-6 lg:px-8'>
      {/* BREADCRUMB */}
      <div className="flex flex-wrap items-center gap-2 text-[#e0e0e0] text-sm sm:text-base">
        <Link to="/" className="font-bold">Home</Link>
        <span>•</span>
        <span className="break-words">Your Online Place for Everything Computers.</span>
      </div>

      {/* INTRODUCTION */}
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <div>
          <h1 
            className="mt-4 sm:mt-8 mb-6 sm:mb-8 text-[#e0e0e0] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
          >
            Your Online Place for Everything Computers.
          </h1>
        </div>
      </div>

      {/* CATEGORIES */}
      <MainCategories />

      {/* SEARCH COMPONENT - Tight margins */}
      <div className="mt-1 mb-2">
        <Search />
      </div>

      {/* FEATURED POSTS - Reduced top margin */}
      <div>
        <h1 className="mt-4 mb-6 text-xl sm:text-2xl text-[#e0e0e0]">Featured Posts</h1>
        <FeaturedPosts />
      </div>
      
      {/* POST LIST */}
      <div>
        <h1 className="my-6 sm:my-8 text-xl sm:text-2xl text-[#e0e0e0]">Recent Posts</h1>
        <PostList />
      </div>
    </div>
  );
};

export default HomePage;
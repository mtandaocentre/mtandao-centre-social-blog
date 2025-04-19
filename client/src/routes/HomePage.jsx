import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

const HomePage = () => {
  return (
    <div className='mt-4 flex flex-col gap-4'>
      
      {/* BREADCRUMB */}
      <div className="flex gap-4 text-[#e0e0e0]">
        <Link to="/" className="font-bold">Home</Link>
        <span>•</span>
        <span>Blogs and Articles</span>
      </div>

      {/* INTRODUCTION */}
      <div className="flex items-centre justify-between">
        <div>
          <h1 
            className="text-[#e0e0e0] text-2xl md:text-5xl lg:text-6xl font-bold"
          >
            Your Online Place for Everything Computers.
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Your Online Place for Everything Computers.
          </p>
        </div>
      </div>

      {/* CATEGORIES */}
      <MainCategories />

      {/* FEATURED POSTS */}
      <FeaturedPosts />
      
      {/* POST LIST */}
      <div className="">
        <h1 className="my-8 text-2xl text-[#e0e0e0]">Recent Posts</h1>
        <PostList />
      </div>
    </div>
  );
};

export default HomePage;

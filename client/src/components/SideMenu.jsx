import Search from "./Search";
import { useSearchParams } from "react-router-dom";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value,
      });
    }
  };

  const handleCategoryChange = (category) => {
    const currentParams = Object.fromEntries(searchParams.entries());

    if (category === "all posts") {
      delete currentParams.cat;
    } else {
      currentParams.cat = category;
    }

    setSearchParams(currentParams);
  };

  // Full categories list
  const categories = [
    { name: "All Posts", value: "all posts" },
    { name: "AI", value: "ai" },
    { name: "AR", value: "ar" },
    { name: "Audio", value: "audio" },
    { name: "Blockchain", value: "blockchain" },
    { name: "Cloud", value: "cloud" },
    { name: "Data", value: "data" },
    { name: "E-Learning", value: "e-learning" },
    { name: "FarmTech", value: "farmtech" },
    { name: "FilmTech", value: "filmtech" },
    { name: "FoodTech", value: "foodtech" },
    { name: "FinTech", value: "fintech" },
    { name: "Gaming", value: "gaming" },
    { name: "General", value: "general" },
    { name: "Graphics", value: "graphics" },
    { name: "GreenTech", value: "greentech" },
    { name: "Hardware", value: "hardware" },
    { name: "HealthTech", value: "healthtech" },
    { name: "History", value: "history" },
    { name: "IoT", value: "iot" },
    { name: "LLM", value: "llm" },
    { name: "Mobile", value: "mobile" },
    { name: "Music", value: "music" },
    { name: "Networks", value: "networks" },
    { name: "Programming", value: "programming" },
    { name: "Quantum", value: "quantum" },
    { name: "Robotics", value: "robotics" },
    { name: "Security", value: "security" },
    { name: "Software", value: "software" },
    { name: "Telecoms", value: "telecoms" },
    { name: "UI/UX", value: "ui/ux" },
    { name: "Video", value: "video" },
    { name: "VR", value: "vr" },
    { name: "Web", value: "web" },
  ];

  return (
    <div className="px-4 sticky top-8 h-[calc(100vh-4rem)] flex flex-col"> {/* Changed to full viewport height minus header */}

      {/* Search Section */}
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />

      {/* Filter Section */}
      <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
      <div className="flex flex-col gap-2 text-sm mb-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] border-[#e0e0e0] cursor-pointer rounded-sm bg-[#1b1c1c] checked:bg-[#a3a3a3]"
          />
          Newest
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            className="appearance-none w-4 h-4 border-[1.5px] border-[#e0e0e0] cursor-pointer rounded-sm bg-[#1b1c1c] checked:bg-[#a3a3a3]"
          />
          Most Popular
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] border-[#e0e0e0] cursor-pointer rounded-sm bg-[#1b1c1c] checked:bg-[#a3a3a3]"
          />
          Trending
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] border-[#e0e0e0] cursor-pointer rounded-sm bg-[#1b1c1c] checked:bg-[#a3a3a3]"
          />
          Oldest
        </label>
      </div>

      {/* Categories Section - Modified to prevent bottom sticking */}
      <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
      <div
        className="flex flex-col gap-2 text-sm h-full overflow-y-hidden 
          hover:overflow-y-auto pr-2 transition-[overflow] duration-300 
          custom-scrollbar mt-4 pb-4"
      >
        {categories.map((cat) => (
          <span
            key={cat.value}
            className="underline cursor-pointer hover:text-blue-400 transition-colors py-1"
            onClick={() => handleCategoryChange(cat.value)}
          >
            {cat.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
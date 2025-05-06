import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MainCategories = () => {
  const scrollRef = useRef();
  const [showArrows, setShowArrows] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const categories = [
    { label: "All Posts", to: "/posts", isAllPosts: true },
    { label: "AI", to: "/posts?cat=ai" },
    { label: "AR", to: "/posts?cat=ar" },
    { label: "Audio", to: "/posts?cat=audio" },
    { label: "Blockchain", to: "/posts?cat=blockchain" },
    { label: "Cloud", to: "/posts?cat=cloud" },
    { label: "Data", to: "/posts?cat=data" },
    { label: "e-learning", to: "/posts?cat=e-learning" },
    { label: "FarmTech", to: "/posts?cat=farmtech" },
    { label: "FilmTech", to: "/posts?cat=filmtech" },
    { label: "FinTech", to: "/posts?cat=fintech" },
    { label: "FoodTech", to: "/posts?cat=foodtech" },
    { label: "Gaming", to: "/posts?cat=gaming" },
    { label: "Graphics", to: "/posts?cat=graphics" },
    { label: "GreenTech", to: "/posts?cat=greentech" },
    { label: "Hardware", to: "/posts?cat=hardware" },
    { label: "HealthTech", to: "/posts?cat=healthtech" },
    { label: "History", to: "/posts?cat=history" },
    { label: "IoT", to: "/posts?cat=iot" },
    { label: "LLM", to: "/posts?cat=LLM" },
    { label: "Mobile", to: "/posts?cat=mobile" },
    { label: "Music", to: "/posts?cat=music" },
    { label: "Networks", to: "/posts?cat=networks" },
    { label: "Programming", to: "/posts?cat=programming" },
    { label: "Quantum", to: "/posts?cat=quantum" },
    { label: "Robotics", to: "/posts?cat=robotics" },
    { label: "Security", to: "/posts?cat=security" },
    { label: "Software", to: "/posts?cat=software" },
    { label: "Telecoms", to: "/posts?cat=telecoms" },
    { label: "UI/UX", to: "/posts?cat=ui/ux" },
    { label: "Video", to: "/posts?cat=video" },
    { label: "VR", to: "/posts?cat=vr" },
    { label: "Web", to: "/posts?cat=web" }
  ];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {/* Left fade mask */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1b1c1c] to-transparent z-10 pointer-events-none" />
      
      {/* Right fade mask */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1b1c1c] to-transparent z-10 pointer-events-none" />

      {/* Left arrow - shown on hover or always on mobile */}
      {(showArrows || window.innerWidth < 768) && (
        <button 
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#2a2a2a] rounded-full p-1 z-20 shadow-md hover:bg-[#3a3a3a]"
        >
          <ChevronLeft size={20} className="text-[#e0e0e0]" />
        </button>
      )}
      
      {/* Categories list */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-10"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map(({ label, to, isAllPosts }) => (
          <Link
            key={label}
            to={to}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
              isAllPosts
                ? "bg-[#f0f0f0] text-[#1b1c1c] hover:bg-[#e0e0e0]" // Whitish background for All Posts
                : "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#e0e0e0]" // Default style for others
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      
      {/* Right arrow - shown on hover or always on mobile */}
      {(showArrows || window.innerWidth < 768) && (
        <button 
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#2a2a2a] rounded-full p-1 z-20 shadow-md hover:bg-[#3a3a3a]"
        >
          <ChevronRight size={20} className="text-[#e0e0e0]" />
        </button>
      )}
    </div>
  );
};

export default MainCategories;
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Search from "./Search";

const MainCategories = () => {
  const scrollRef = useRef();
  const [showArrows, setShowArrows] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="hidden md:flex bg-[#a3a3a3] rounded-3xl xl:rounded-full px-4 py-2 shadow-lg items-center justify-between gap-4 text-[#1b1c1c] font-bold text-sm overflow-hidden w-full"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {/* Left Arrow */}
      {showArrows && (
        <button
          onClick={() => scroll("left")}
          className="bg-[#d4d4d4] rounded-full p-1.5 shadow-md hover:bg-[#b3b3b3] flex-shrink-0"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 flex-nowrap overflow-x-auto no-scrollbar min-w-0 px-4"
      >
        {[
          { label: "All Posts", to: "/posts", active: true },
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
          { label: "Web", to: "/posts?cat=web" },
        ].map(({ label, to, active }) => (
          <Link
            key={label}
            to={to}
            className={`rounded-full px-4 py-1.5 whitespace-nowrap ${
              active
                ? "bg-[#1b1c1c] text-[#e0e0e0]"
                : "hover:bg-[#737373] text-[#1b1c1c]"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right Arrow OUTSIDE scroll area, but before separator */}
      {showArrows && (
        <button
          onClick={() => scroll("right")}
          className="bg-[#d4d4d4] rounded-full p-1.5 shadow-md hover:bg-[#b3b3b3] flex-shrink-0"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Separator */}
      <span className="text-xl font-medium">|</span>

      {/* Search with reduced width */}
      <div className="font-normal w-42">
        <Search />
      </div>
    </div>
  );
};

export default MainCategories;

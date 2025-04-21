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
          { label: "AIoT", to: "/posts?cat=aiot" },
          { label: "Cloud", to: "/posts?cat=cloud" },
          { label: "Data", to: "/posts?cat=data" },
          { label: "General", to: "/posts?cat=general" },
          { label: "Hardware", to: "/posts?cat=hardware" },
          { label: "Security", to: "/posts?cat=security" },
          { label: "Software", to: "/posts?cat=software" },
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

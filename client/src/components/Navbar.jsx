import { useEffect, useState, useRef } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
  SignOutButton,
} from "@clerk/clerk-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown menu

  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    getToken().then((token) => console.log(token));
  }, [getToken]);

  // Close dropdown if click is outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinkStyle = "hover:text-[#5f5f5f] transition-colors duration-200";

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between px-4 relative">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="mtandao-logo.png" alt="Mtandao logo" w={32} h={32} />
        <span>mtandao centre</span>
      </Link>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "X" : "≡"}
        </div>
        <div
          className={`w-full h-screen flex flex-col 
            items-center justify-center gap-8 font-medium 
            text-lg absolute top-16 left-0 bg-[#e0e0e0] text-[#1b1c1c] 
            transition-all ease-in-out z-20
            ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Link to="/" className={navLinkStyle}>Home</Link>
          <Link to="/posts?sort=trending" className={navLinkStyle}>Trending</Link>
          <Link to="/posts?sort=popular" className={navLinkStyle}>Most Popular</Link>
          <Link to="/" className={navLinkStyle}>About</Link>

          <SignedOut>
            <Link to="/login">
              <button className="py-2 px-4 rounded-3xl bg-[#1b1c1c] text-[#e0e0e0]">
                Login
              </button>
            </Link>
          </SignedOut>

          <SignedIn>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
            >
              <img
                src={user?.imageUrl}
                alt="user"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-base font-semibold text-[#e0e0e0]">
                {user?.firstName}
              </span>
            </button>

            {dropdownOpen && (
              <div ref={dropdownRef} className="mt-4 bg-[#d1cfcf] shadow-xl rounded-lg p-4 w-40">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block text-sm py-1 px-2 rounded-md text-[#6e6e6e] hover:text-[#1b1c1c] transition-colors duration-200"
                >
                  Profile
                </Link>

                <Link
                  to="/write"
                  onClick={() => setDropdownOpen(false)}
                  className="block text-sm py-1 px-2 rounded-md text-[#6e6e6e] hover:text-[#1b1c1c] transition-colors duration-200"
                >
                  Write a Post
                </Link>

                <SignOutButton>
                  <button className="block w-full text-left text-sm py-1 px-2 rounded-md text-[#6e6e6e] hover:text-[#1b1c1c] transition-colors duration-200">
                    Logout
                  </button>
                </SignOutButton>
              </div>
            )}
          </SignedIn>
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-bold">
        <Link to="/" className={navLinkStyle}>Home</Link>
        <Link to="/posts?sort=trending" className={navLinkStyle}>Trending</Link>
        <Link to="/posts?sort=popular" className={navLinkStyle}>Most Popular</Link>
        <Link to="/" className={navLinkStyle}>About</Link>

        <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-[#e0e0e0] text-[#1b1c1c]">
              Login
            </button>
          </Link>
        </SignedOut>

        <SignedIn>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
            >
              <img
                src={user?.imageUrl}
                alt="user"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-base font-semibold text-[#e0e0e0] md:text-lg">
                {user?.firstName}
              </span>
            </button>

            {dropdownOpen && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 bg-[#d1cfcf] shadow-lg rounded-lg p-3 w-40 z-30">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block text-sm py-1 px-2 rounded-md text-[#6e6e6e] hover:text-[#1b1c1c] transition-colors duration-200"
                >
                  Profile
                </Link>

                <Link
                  to="/write"
                  onClick={() => setDropdownOpen(false)}
                  className="block text-sm py-1 px-2 rounded-md text-[#6e6e6e] hover:text-[#1b1c1c] transition-colors duration-200"
                >
                  Write a Post
                </Link>

                <SignOutButton>
                  <button className="block w-full text-left text-sm py-1 px-2 rounded-md text-[#6e6e6e] hover:text-[#1b1c1c] transition-colors duration-200">
                    Logout
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;

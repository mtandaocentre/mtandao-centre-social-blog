import { useEffect, useState, useRef } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
  SignOutButton,
} from "@clerk/clerk-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    getToken().then((token) => console.log(token));
  }, [getToken]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkStyle = "hover:text-[#5f5f5f] transition-colors duration-200";

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 relative bg-[#1b1c1c]">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 md:gap-4 text-xl md:text-2xl font-bold text-[#e0e0e0]">
        <Image src="mtandao-logo.png" alt="Mtandao logo" w={32} h={32} />
        <span>mtandao centre</span>
      </Link>

      {/* MOBILE MENU BUTTON */}
      <div className="md:hidden relative">
        <button 
          className="text-[#e0e0e0] p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 top-12 bg-[#2a2a2a] shadow-lg z-20 p-4 rounded-lg w-48"
          >
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="text-[#e0e0e0] hover:bg-[#3a3a3a] px-2 py-1.5 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/posts?sort=trending" 
                className="text-[#e0e0e0] hover:bg-[#3a3a3a] px-2 py-1.5 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trending
              </Link>
              <Link 
                to="/posts?sort=popular" 
                className="text-[#e0e0e0] hover:bg-[#3a3a3a] px-2 py-1.5 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Most Popular
              </Link>
              <Link 
                to="/about" 
                className="text-[#e0e0e0] hover:bg-[#3a3a3a] px-2 py-1.5 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>

              <SignedOut>
                <Link 
                  to="/login" 
                  className="py-1.5 px-2 rounded bg-[#1b1c1c] text-[#e0e0e0] text-center hover:bg-[#3a3a3a]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </SignedOut>

              <SignedIn>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 w-full text-[#e0e0e0] hover:bg-[#3a3a3a] px-2 py-1.5 rounded"
                  >
                    <img
                      src={user?.imageUrl}
                      alt="user"
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{user?.firstName}</span>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="mt-1 ml-4 bg-[#3a3a3a] rounded-lg p-2 space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="block px-2 py-1 rounded hover:bg-[#4a4a4a] text-[#e0e0e0] text-sm"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/write"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="block px-2 py-1 rounded hover:bg-[#4a4a4a] text-[#e0e0e0] text-sm"
                      >
                        Write a Post
                      </Link>
                      <SignOutButton>
                        <button className="block w-full text-left px-2 py-1 rounded hover:bg-[#4a4a4a] text-[#e0e0e0] text-sm">
                          Logout
                        </button>
                      </SignOutButton>
                    </div>
                  )}
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10 font-medium">
        <Link to="/" className={navLinkStyle}>Home</Link>
        <Link to="/posts?sort=trending" className={navLinkStyle}>Trending</Link>
        <Link to="/posts?sort=popular" className={navLinkStyle}>Most Popular</Link>
        <Link to="/about" className={navLinkStyle}>About</Link>

        <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-[#e0e0e0] text-[#1b1c1c] hover:bg-[#c0c0c0] transition-colors">
              Login
            </button>
          </Link>
        </SignedOut>

        <SignedIn>
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2"
            >
              <img
                src={user?.imageUrl}
                alt="user"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-[#e0e0e0]">
                {user?.firstName}
              </span>
            </button>

            {isProfileDropdownOpen && (
              <div 
                ref={dropdownRef}
                className="absolute right-0 mt-2 bg-[#2a2a2a] shadow-lg rounded-lg p-2 w-48 z-30 space-y-2"
              >
                <Link
                  to="/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="block px-3 py-1.5 rounded hover:bg-[#3a3a3a] text-[#e0e0e0]"
                >
                  Profile
                </Link>
                <Link
                  to="/write"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="block px-3 py-1.5 rounded hover:bg-[#3a3a3a] text-[#e0e0e0]"
                >
                  Write a Post
                </Link>
                <SignOutButton>
                  <button className="block w-full text-left px-3 py-1.5 rounded hover:bg-[#3a3a3a] text-[#e0e0e0]">
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
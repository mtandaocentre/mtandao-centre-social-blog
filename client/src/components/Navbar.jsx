import { useEffect, useState } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { 
  SignedIn, 
  SignedOut, 
  useAuth, 
  UserButton 
} from "@clerk/clerk-react";

const Navbar = () => {
  // Create useState hook to handle the opening and closing of mobile menu
  const [open, setOpen] = useState(false);

  // Get authentication token from react app using useAuth
  const { getToken } = useAuth();

  // Test token using useEffect
  useEffect(() => {
    getToken().then((token) => console.log(token));
  },[])
  
  return (
    /* Format the Navbar container */
    <div className='w-full h-16 md:h-20 flex items-center justify-between'>
        
        {/* Add logo */}
        {/* - Add styling to logo  
            - Add text span and style it 
            - Source image from imagekit CDN
            - Change image source to Image component 
            - Give logo and title a link leading to home page
        */}
        <Link to="/" 
          className="flex items-center gap-4 text-2xl font-bold"
        >
            <Image 
              src="mtandao-logo.png" 
              alt="Mtandao logo" 
              w={32} 
              h={32} 
            />       
            <span>mtandao centre</span>
        </Link>

        {/*MOBILE*/}
        {/*Add responsivenes for mobile screen*/}
        <div className="md:hidden">

          {/* MOBILE BUTTON */}
          {/* 
              - Create an opening and closing button for the mobile menu
              - Add onClick functionality  
          */}
          <div 
            className="cursor-pointer text-4xl" 
            onClick={()=>setOpen((prev)=>!prev)
          }>
            {/* Added triple bar */}
            {open ? "X" : "≡" }
          </div>

          {/* MOBILE LINK LIST */}
          {/* - Add styling to mobile link list
              - Add animation to mobile link list 
              - Add transition and speed to animation
              - Added and styled links
              - Change mobile links from anchor tags to Links 
          */}
          <div 
            className={`w-full h-screen flex flex-col 
            items-center justify-center gap-8 font-medium 
            text-lg absolute top-16 bg-[#e0e0e0] text-[#1b1c1c] 
            transition-all ease-in-out
            ${ open ? "-right-0" : "-right-[100%]"}`
          } 
          >
            <Link to="/">Home</Link>
            <Link to="/">Trending</Link>
            <Link to="/">Most Popular</Link>
            <Link to="/">About</Link>
            
            {/* If user is signed out, direct them to login page */}
            <SignedOut>
              <Link to="/login">
                <button 
                  className="py-2 px-4 rounded-3xl bg-[#e0e0e0] 
                  text-[#1b1c1c]"
                >
                  Login x
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

        </div>

        {/* DESKTOP */}
        {/* - Add responsivenes for desktop screens
            - Add Navbar links
            - Change desktop links from anchor tags to Links 
            - Change font to bold
        */}
        <div className="hidden md:flex gap-8 xl:gap-12 font-bold">
          <Link to="/">Home</Link>
          <Link to="/">Trending</Link>
          <Link to="/">Most Popular</Link>
          <Link to="/">About</Link>
          
          {/* If user is signed out, direct them to login page */}
          <SignedOut>
            <Link to="/login">
              <button 
                className="py-2 px-4 rounded-3xl bg-[#e0e0e0] 
                text-[#1b1c1c]"
              >
                Login x
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

    </div>
  )
}

export default Navbar
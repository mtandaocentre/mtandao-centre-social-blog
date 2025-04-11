import { Link } from "react-router-dom"
import Search from "./Search"

const MainCategories = () => {
  return (
    <div 
        /*  - Create main catogories back ground
            - Add text color and font
        */
        className='hidden md:flex bg-[#a3a3a3] rounded-3xl 
        xl:rounded-full p-4 shadow-lg items-center justify-center
        gap-2 text-[#1b1c1c] font-bold text-sm'
    >
        {/* Links */}
        <div 
            className="flex-1 flex items-center justify-between 
            flex-wrap"
        >
            {/* Created all post category */}
            <Link to="/posts" 
                className="bg-[#1b1c1c] text-[#e0e0e0] rounded-full
                px-4 py-2"
            >
                All Posts
            </Link>

            {/* - Creat and style all other categories
                - Added new categories 
                - Added Data, IoT and Web3 categories 
            */}
            <Link to="/posts?cat=ai" 
                className="hover:bg-[#737373] text-[#1b1c1c] rounded-full
                px-4 py-2"
            >
                AIoT
            </Link>

            <Link to="/posts?cat=cloud" 
                className="hover:bg-[#737373] text-[#1b1c1c] rounded-full
                px-4 py-2"
            >
                Cloud
            </Link>

            <Link to="/posts?cat=data" 
                className="hover:bg-[#737373] text-[#1b1c1c] rounded-full
                px-4 py-2"
            >
                Data
            </Link>

            <Link to="/posts?cat=hardware" 
                className="hover:bg-[#737373] text-[#1b1c1c] rounded-full
                px-4 py-2"
            >
                Hardware
            </Link>

            <Link to="/posts?cat=security" 
                className="hover:bg-[#737373] text-[#1b1c1c] rounded-full
                px-4 py-2"
            >
                Security
            </Link>

            <Link to="/posts?cat=software" 
                className="hover:bg-[#737373] text-[#1b1c1c] rounded-full
                px-4 py-2"
            >
                Software
            </Link>

            <Link to="/posts?cat=web2" 
                className="hover:bg-[#737373] text-[#1b1c1c] rounded-full
                px-4 py-2"
            >
                Web
            </Link>

        </div>

        {/* Add seperater */}
        <span className="text-xl font-medium">|</span>

        {/* Search */}
        {/* - Add and style serch bar 
            - Changed stroke color
        */}
        <div className=" font-normal">
            <Search />
        </div>
        
    </div>
  )
}

export default MainCategories
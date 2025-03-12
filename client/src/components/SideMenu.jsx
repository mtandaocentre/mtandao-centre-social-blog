import Search from "./Search"
import { Link } from "react-router-dom"

const SideMenu = () => {
  return (
    // Make menu sticky during scroll
    <div className='px-4 h-max sticky top-8 mb-4'>
        
        {/* Create side menu sections titles */}
        <h1 className="mb-4 text-sm font-medium">Search</h1>
        {/* Add Search component */}
        <Search />

        {/* Filter */}
        <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
        {/* Add and style filter */}
        <div className="flex flex-col gap-2 text-sm">
            <label 
                htmlFor="" 
                className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="sort" 
                        value="newest" 
                        className="appearance-none w-4 h-4 border-[1.5px] 
                        border-[#e0e0e0] cursor-pointer rounded-sm
                        bg-[#1b1c1c] checked:bg-[#a3a3a3]"
                    />
                    Newest
            </label>

            <label 
                htmlFor="" 
                className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="sort" 
                        value="popular" 
                        className="appearance-none w-4 h-4 border-[1.5px] 
                        border-[#e0e0e0] cursor-pointer rounded-sm
                        bg-[#1b1c1c] checked:bg-[#a3a3a3]"
                    />
                    Most Popular
            </label>

            <label 
                htmlFor="" 
                className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="sort" 
                        value="trending" 
                        className="appearance-none w-4 h-4 border-[1.5px] 
                        border-[#e0e0e0] cursor-pointer rounded-sm
                        bg-[#1b1c1c] checked:bg-[#a3a3a3]"
                    />
                    Trending
            </label>

            <label 
                htmlFor="" 
                className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="sort" 
                        value="oldest" 
                        className="appearance-none w-4 h-4 border-[1.5px] 
                        border-[#e0e0e0] cursor-pointer rounded-sm
                        bg-[#1b1c1c] checked:bg-[#a3a3a3]"
                    />
                    Oldest
            </label>

        </div>

        {/* Categories */}
        <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
        {/* Add categories container  */}
        <div className="flex flex-col gap-2 text-sm">
            <Link className="underline" to="/posts">All</Link>
            <Link className="underline" to="/posts?cat=ai">AI</Link>
            <Link className="underline" to="/posts?cat=cloud">Cloud</Link>
            <Link className="underline" to="/posts?cat=data">Data</Link>
            <Link className="underline" to="/posts?cat=hardware">Hardware</Link>
            <Link className="underline" to="/posts?cat=iot">IoT</Link>
            <Link className="underline" to="/posts?cat=security">Security</Link>
            <Link className="underline" to="/posts?cat=software">Software</Link>
            <Link className="underline" to="/posts?cat=web2">Web2</Link>
            <Link className="underline" to="/posts?cat=web3">Web3</Link>
        </div>
    </div>
  )
}

export default SideMenu
import Search from "./Search"
import { useSearchParams } from "react-router-dom"

const SideMenu = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const handleFilterChange = (e) =>{

        if(searchParams.get("sort") !== e.target.value) {
            setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                sort:e.target.value,
            })
        }
 
    }

    const handleCategoryChange = (category) => {
        const currentParams = Object.fromEntries(searchParams.entries());
    
        if (category === "all posts") {
            delete currentParams.cat; // remove the category filter
        } else {
            currentParams.cat = category;
        }
    
        setSearchParams(currentParams);
    };

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
                        onChange={handleFilterChange}
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
                        onChange={handleFilterChange}
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
                        onChange={handleFilterChange}
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
                        onChange={handleFilterChange}
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
            
            <span 
                className="underline cursor-pointer" 
                onClick={()=>handleCategoryChange("all posts")}
            >
                All Posts
            </span>

            <span 
                className="underline cursor-pointer" 
                onClick={()=>handleCategoryChange("aiot")}
            >
                AIoT
            </span>

            <span 
                className="underline cursor-pointer" 
                onClick={()=>handleCategoryChange("cloud")}
            >
                Cloud
            </span>

            <span 
                className="underline cursor-pointer" 
                onClick={()=>handleCategoryChange("data")}
            >
                Data
            </span>

            <span 
                className="underline cursor-pointer" 
                onClick={()=>handleCategoryChange("general")}
            >
                General
            </span>

            <span 
                className="underline cursor-pointer" 
                onClick={()=>handleCategoryChange("hardware")}
            >
                Hardware
            </span>

            <span 
                className="underline cursor-pointer" 
                onClick={()=>handleCategoryChange("security")}
            >
                Security
            </span>

            <span 
                className="underline cursor-pointer" 
                onClick={()=>handleCategoryChange("software")}
            >
                Software
            </span>

            <span 
                className="underline cursor-pointer" 
                onClick={()=>handleCategoryChange("web")}
            >
                Web
            </span>

        </div>
    </div>
  )
}

export default SideMenu
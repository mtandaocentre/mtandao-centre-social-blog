import { useState } from "react"
import PostList from "../components/PostList"
import SideMenu from "../components/SideMenu"

const PostListPage = () => {

  // Use stae hook to handle button on small screens
  const [open,setOpen] = useState(false)

  return (
    <div className=''>
      {/* Add page title */}
      <h1 className="mb-8 text-2xl">Category Blog</h1>

      {/* Small screen side menu button */}
      <button 
        className="bg-[#a3a3a3] text-[#1b1c1c] px-4 py-2
        rounded-2xl mb-4 font-semibold md:hidden"
        onClick={()=>setOpen(prev=>!prev)}>
          {open ? "Close" : "Filter or Search"} 
      </button>

      {/* Create parent view */}
      {/* Add responsiveness to side menu */}
      <div className="flex flex-col-reverse gap-8 md:flex-row">

        {/* Add PostList component */}
        <div className="">
          <PostList />
        </div>

        {/* Add SideMenu Component */}
        {/* Hide and show menu depending on button state */}
        <div className={`${open ? "block" : "hidden"} md:block`}>
          <SideMenu />
        </div>
      </div>

    </div>
  )
}

export default PostListPage
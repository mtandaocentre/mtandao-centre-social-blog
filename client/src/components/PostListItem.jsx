import Image from "./Image"
import { Link} from "react-router-dom"
import { format } from "timeago.js"
import { FaEye } from "react-icons/fa"  // Import the eye icon

const PostListItem = ({post}) => {
  return (
    /* - Style PostListItem container 
       - Adjusted Image and details container sizes
       - Adjusted image width
    */
    <div className='flex flex-col xl:flex-row gap-8 mb-12'>
        {/* Image */}
        {/* Add and style PostListItem image */}
        {post.img && (
            <div className="md:hidden xl:block xl:w-1/3">
                <Image 
                    src={post.img}
                    className="rounded-2xl object-cover" w="735"
                />
            </div>
        )}

        {/* Details */}
        {/* - Add title and by line
            - Add destcription and read more link 
        */}
        <div className="flex flex-col gap-4 xl:w-2/3">
            <Link to={`/${post.slug}`} className="text-4xl font-semibold">
                {post.title}
            </Link>
            
            <div className="flex items-center gap-2 text-[#e0e0e0]">
                
                <Link className="text-[#e0e0e0] font-bold">{post.category}</Link>
                <span>Written by</span>
                <Link className="text-[#e0e0e0] font-bold">{post.user.username}</Link>
                <span>{format(post.createdAt)}</span>
                
                {/* Views Counter */}
                <div 
                    className="flex items-center gap-1 bg-[#e0e0e0] px-2 py-1 rounded-full 
                    text-xs font-semibold text-[#1b1c1c]"
                >
                    <FaEye className="w-3 h-3 opacity-80" />
                    <span>{post.visit} views</span>
                </div>
                
            </div>

            <p>
                {post.desc}
            </p>

            <Link to={`/${post.slug}`} className="underline text-[#e0e0e0] font-bold text-sm">
                Read More
            </Link>
        </div>
    </div>
  )
}

export default PostListItem
import { format } from "timeago.js"
import Image from "./Image"

const Comment = ({comment}) => {
  return (
    // Style Comment root container
    <div 
      className='p-4 bg-[#a3a3a3] rounded-xl mb-8 text-[#1b1c1c]'
    >
      {/* Create and style user information */}
      <div className="flex items-center gap-4">
        {comment.user.img && <Image 
          src={comment.user.img}
          className="w-10 h-10 rounded-full object-cover" w="40"
        />}
        <span className="font-medium">{comment.user.username}</span>
        <span className="text-sm text-[#1b1c1c]">{format(comment.createdAt)}</span>
      </div>

      {/* Add comment place holder */}
      <div className="mt-4">
        <p>
          {comment.desc}
        </p>
      </div>
    </div>
  )
}

export default Comment
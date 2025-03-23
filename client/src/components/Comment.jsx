import { format } from "timeago.js"
import Image from "./Image"
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const Comment = ({comment, postId}) => {

  const { user } = useUser();
  const { getToken } = useAuth();
  const role = user?.publicMetadata?.role;

  const queryClient = useQueryClient();
  
  // Mutate data using useMutation
  const mutation = useMutation({
      
      mutationFn: async () => {
          const token = await getToken();
          return axios.delete(
              `${import.meta.env.VITE_API_URL}/comments/${comment._id}`, 
              {
                  headers: {
                  Authorization: `Bearer ${token}`,
                  },
              }
          );
      },
  
      // Use navigate to navigate to new article on success
      // Add toast for success
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        toast.success("Comment deleted successfully!");
      },

      onError: (error) => {
          toast.error(error.response.data);
      },
  
  });

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
        {user && (comment.user.username === user.username || role === "admin") && (
          <span 
            className="text-xs text-red-600 hover:text-red-900 cursor-pointer" 
            onClick={() => mutation.mutate()}
          >
            Delete
            {mutation.isPending && <span>(Deleting...)</span>}
          </span>
        )}
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
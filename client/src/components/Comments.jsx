import axios from "axios";
import Comment from "./Comment"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const fetchComments = async (postId) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
    return res.data;
};

const Comments = ({postId}) => {  

    const { user } = useUser();
    const { getToken } = useAuth();

    const { isPending, error, data } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
    });

    const queryClient = useQueryClient();

    // Mutate data using useMutation
    const mutation = useMutation({
        
        mutationFn: async (newComment) => {
            const token = await getToken();
            return axios.post(
                `${import.meta.env.VITE_API_URL}/comments/${postId}`, 
                newComment, 
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
          queryClient.invalidateQueries({queryKey: ["comments", postId]});
        },

        onError: (error) => {
            toast.error(error.response.data);
        },
    
    });

    const handleSubmit = e => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            desc: formData.get("desc"),
        };

        mutation.mutate(data);

    };

    return (
        // Initiate and style Comments mother container
        <div className='flex flex-col gap-8 lg:w-3/5 mb-12'>

            {/* Add section title */}
            <h1 className="text-xl text-[#e0e0e0] underline">Comments</h1>

            {/* Create comment input area */}
            {/* Add and style button */}
            {/* Style content input area */}
            <form 
                onSubmit={handleSubmit} 
                className="flex items-center justify-between gap-8 w-full"
            >
                <textarea 
                    name="desc"
                    placeholder="Write a comment..." 
                    className="w-full p-4 rounded -xl text-[#1b1c1c]" 
                />
                <button 
                    className="bg-[#a3a3a3] px-4 py-3 text-[#1b1c1c] 
                    font-medium rounded-xl"
                >
                    Send
                </button>
            </form>
            {/* Add single comment components */}
            {isPending 
                ? "Loading..." 
                : error 
                ? "Error loading comment!" 
                : 
            <>

            {
                mutation.isPending && (
                    <Comment comment={{
                        desc: `${mutation.variables.desc} (Sending...)`,
                        createdAt: new Date(),
                        user:{
                            img: user.imageUrl,
                            username: user.username,
                        }
                    }}/>
                )
            }

            {data.map((comment) => (
                <Comment key={comment._id} comment={comment} postId={postId}/>
            ))}
            </>
               
            }
            
        </div>
    )
}

export default Comments
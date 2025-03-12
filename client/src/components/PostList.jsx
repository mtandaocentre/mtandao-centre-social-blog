import PostListItem from "./PostListItem"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import axios from "axios"
import InfiniteScroll from "react-infinite-scroll-component"

// Use axios to fetch post
const fetchPosts = async (pageParam) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params : { page: pageParam, limit: 2 },
  });
  return res.data;
};

const PostList = () => {

  // use infinite queries to Fetch data
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  console.log(data)

  if (isFetching) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  // convert allPosts into a single array using flatMap
  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  console.log(data)

  return (
    /* - Style post list container 
       - Add more post list items to post list
    */

    <InfiniteScroll
      dataLength={allPosts.length} 
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more posts...</h4>}
      endMessage={
        <p>
          <b>All posts loaded!</b>
        </p>
      }
    >
      {/* Add PostListItem component to PostList */}
      {/* Use  allPosts array to map postListItems */}
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </InfiniteScroll>

  )
}

export default PostList
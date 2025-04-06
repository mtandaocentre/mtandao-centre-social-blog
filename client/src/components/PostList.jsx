import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query"
import InfiniteScroll from "react-infinite-scroll-component"
import axios from "axios"
import PostListItem from "./PostListItem"


// Use axios to fetch post
const fetchPosts = async (pageParam, searchParams) => {

  const searchParamsObj = Object.fromEntries([...searchParams])

  // console.log(searchParamsObj);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params : { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;

};

const PostList = () => {

  const [searchParams] = useSearchParams();

  // use infinite queries to Fetch data
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  // console.log(data)

  if (isFetching && !isFetchingNextPage) return <p>Loading...</p>
  if (error) return <p>An error has occurred: {error.message}</p>

  // convert allPosts into a single array using flatMap
  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  // console.log(data)

  return (
    <>
    {allPosts.length === 0 ? (
      <p className="text-[#e0e0e0]">No posts in this category.</p>
    ) : (
      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<h4>Loading more posts...</h4>}
        endMessage={
          <p className="text-[#e0e0e0]">
            <b>All posts loaded!</b>
          </p>
        }
      >
        {allPosts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
      </InfiniteScroll>
    )}
  </>

  )
}

export default PostList
import { useEffect, useRef, useState } from "preact/hooks";
import type { PostData, searchType } from "@utils/types";
import Post from "../templates/Post";
import fetchJson from "@utils/fetchJson";
import User from "../templates/User";
import { debounce } from "@utils/debounce";

export default function SearchFeed({
  currentUser,
  searchQuery,
  searchType,
}: {
  currentUser: string;
  searchQuery: string;
  searchType: searchType;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const pageRef = useRef(0);

  const fetchData = async (): Promise<void> => {
    if (!hasMorePosts) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentPage = pageRef.current;
      const body = {
        query: searchQuery,
        type: searchType,
      };
      const response = await fetchJson(
        `/api/posts/search?page=${currentPage}`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      // Update to check if more posts are available
      if (response.length < 10 || response.Length === 0) {
        setHasMorePosts(false);
      }

      setItems((prevItems) => [...prevItems, ...response]);

      pageRef.current = currentPage + 1;
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchDataDebounced = debounce(fetchData, 500);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchDataDebounced();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, fetchDataDebounced]);
  useEffect(() => {
    return () => {
      fetchDataDebounced.cancel();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center overflow-y-auto z-40 relative">
      {searchType === "Users"
        ? items.map((user, index) => (
            <User
              key={index}
              username={user.username}
              bio={user.description}
              role={user.permissions.role}
            />
          ))
        : items.map((post: PostData, index) => (
            <Post
              key={index}
              id={post.id}
              username={post.user.username}
              role={post.user.permissions.role}
              title={post.title}
              content={post.content}
              date={post.postedDate}
              commentCount={post.comments.length}
              currentUser={currentUser}
              onFeed={true}
            />
          ))}

      {isLoading && (
        <span className={"loading loading-dots loading-lg text-accent"}></span>
      )}
      {error && (
        <p>Error: {error instanceof Error ? error.message : "unknown error"}</p>
      )}
      {!hasMorePosts && <p>No more posts</p>}

      <div ref={observerTarget}></div>
    </div>
  );
}

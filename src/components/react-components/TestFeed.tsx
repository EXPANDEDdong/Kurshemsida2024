import { useEffect, useRef, useState } from "preact/hooks";
import type { PostData } from "@utils/types";
import Post from "../templates/Post";
import fetchJson from "@utils/fetchJson";
import { useStore } from "@nanostores/preact";
import { mainFeedState, initialFeedDidLoad } from "~/store";
import { debounce } from "@utils/debounce";

export default function TestFeed({
  initialFeed,
  currentUser,
}: {
  initialFeed: PostData[];
  currentUser: string;
}) {
  const $didLoadInitial = useStore(initialFeedDidLoad);

  if ($didLoadInitial) {
    initialFeed = [];
  }
  useEffect(() => {
    initialFeedDidLoad.set(true);
  }, []);

  const $feedState = useStore(mainFeedState);

  return (
    <Feed
      key={$feedState}
      initialFeed={initialFeed}
      currentUser={currentUser}
    />
  );
}

function Feed({
  initialFeed,
  currentUser,
}: {
  initialFeed: PostData[];
  currentUser: string;
}) {
  const [items, setItems] = useState<PostData[]>(initialFeed);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const $didLoadInitial = useStore(initialFeedDidLoad);

  const pageRef = useRef($didLoadInitial ? 0 : 1);

  const fetchData = async (): Promise<void> => {
    if (!hasMorePosts) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentPage = pageRef.current;
      const response = await fetchJson<PostData[]>(
        `/api/posts/page?page=${currentPage}`
      );
      if (!response) {
        throw new Error("Error fetching posts.");
      }

      // Update to check if more posts are available
      if (response.length < 10) {
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
      {items.map((post, index) => (
        <Post
          key={index}
          id={post.id}
          username={post.user.username}
          role={post.user.permissions.role}
          title={post.title}
          content={post.content}
          date={post.postedDate}
          currentUser={currentUser}
          commentCount={post.comments.length}
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

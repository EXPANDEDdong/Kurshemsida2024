import { useEffect, useState } from "preact/hooks";
import type { PostData, userRole } from "@utils/types";
import Post from "@components/templates/Post";

export default function PostList({
  feed,
  role,
  currentUser,
}: {
  feed: PostData[];
  role: userRole;
  currentUser: string;
}) {
  useEffect(() => {
    getPosts(feed);
  }, []);
  const [posts, setPosts] = useState<PostData[]>([]);

  async function getPosts(feed: PostData[]) {
    setPosts(feed);
  }
  return (
    <div className="flex flex-col gap-4 items-center">
      {posts.map((post: PostData, index) => (
        <Post
          key={index}
          id={post.id}
          username={post.user.username}
          role={role}
          title={post.title}
          content={post.content}
          date={post.postedDate}
          commentCount={post.comments.length}
          currentUser={currentUser}
          onFeed={true}
        />
      ))}
    </div>
  );
}

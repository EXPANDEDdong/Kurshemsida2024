import { useEffect, useState } from "preact/hooks";
import type { PostsOnFeed } from "~/server/posts";
import Post from "./blocks/Post";
import type { userRole } from "./blocks/User";

export default function PostFeed({
  feed,
  role,
  currentUser,
}: {
  feed: PostsOnFeed[];
  role: userRole;
  currentUser: string;
}) {
  useEffect(() => {
    getPosts(feed);
  }, []);
  const [posts, setPosts] = useState<PostsOnFeed[]>([]);

  async function getPosts(feed: PostsOnFeed[]) {
    setPosts(feed);
  }
  return (
    <div className="flex flex-col gap-4 items-center">
      {posts.map((post: PostsOnFeed, index) => (
        <Post
          key={index}
          id={post.id}
          username={post.user.username}
          role={role}
          title={post.title}
          content={post.content}
          date={post.postedDate}
          currentUser={currentUser}
          onFeed={true}
        />
      ))}
    </div>
  );
}

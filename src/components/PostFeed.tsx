import fetchJson from "@utils/fetchJson";
import { useEffect, useState } from "preact/hooks";
import type { PostsData } from "../server/users";
import type { PostsOnFeed } from "~/server/posts";
import Post from "./blocks/Post";

export default function PostFeed({ feed }: { feed: PostsOnFeed[] }) {
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
          title={post.title}
          content={post.content}
          date={post.postedDate}
          onFeed={true}
        />
      ))}
    </div>
  );
}

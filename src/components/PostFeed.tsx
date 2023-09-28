import fetchJson from "@utils/fetchJson";
import { useEffect, useState } from "preact/hooks";

interface PostsArray {
  id: number;
  title: string;
  content: string;
}

export default function PostFeed() {
  useEffect(() => {
    getPosts();
  }, []);
  const [posts, setPosts] = useState([]);

  async function getPosts() {
    const result = await fetchJson("/api/feed", {
      method: "GET",
    });
    const posts = await result;
    setPosts(posts);
  }
  return (
    <div>
      {posts?.map((post: PostsArray) => (
        <div key={post?.id}>
          <h3>{post?.title}</h3>
          <p>{post?.content}</p>
        </div>
      ))}
    </div>
  );
}

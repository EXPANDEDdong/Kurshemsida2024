import fetchJson from "@utils/fetchJson";
import { useEffect, useState } from "preact/hooks";
import type { PostsData } from "../server/users";
import type { PostsOnFeed } from "~/server/posts";

interface User {
  username: string;
  description: string;
}

export default function CurrentUser() {
  useEffect(() => {
    // const feedData: PostsData[] = feed;
    getUser();
  }, []);
  const [user, setUser] = useState<User>({});

  async function getUser() {
    const result = await fetchJson("/api/loggedinuser");
    setUser(result);
  }
  return (
    <div className="flex flex-col gap-4 items-center">
      <p>{user.username}</p>
      <p>{user.description}</p>
    </div>
  );
}

import { useEffect, useState } from "preact/hooks";
import type { CommentsData } from "../server/users";

export default function PostFeed({ comments }: { comments: CommentsData[] }) {
  useEffect(() => {
    getComms(comments);
  }, []);
  const [commentsList, setComments] = useState<CommentsData[]>([]);

  async function getComms(comments: CommentsData[]) {
    setComments(comments);
  }
  return (
    <div className="flex flex-col gap-4 items-center">
      {commentsList.map((comm: CommentsData, index) => (
        <div
          key={index}
          className="py-4 px-6 bg-neutral-50 rounded-lg shadow-lg w-11/12 relative"
        >
          <a href={`/user/${comm.user.username}`} className={"w-fit"}>
            {comm.user.username}
          </a>
          <div className={"w-full h-full relative"}>
            <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
            <p className="text-neutral-900 text-lg">{comm.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

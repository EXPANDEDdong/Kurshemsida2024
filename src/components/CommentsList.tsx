import { useEffect, useState } from "preact/hooks";
import type { CommentsData } from "../server/users";
import Comment from "@components/blocks/Comment";

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
        <Comment
          key={index}
          username={comm.user.username}
          content={comm.content}
          date={comm.postedDate}
        />
      ))}
    </div>
  );
}

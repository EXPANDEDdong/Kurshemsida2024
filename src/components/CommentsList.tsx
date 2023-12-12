import { useEffect, useState } from "preact/hooks";
import type { CommentsData } from "../server/users";
import Comment from "@components/blocks/Comment";

export default function CommentsFeed({
  comments,
  currentUser,
  onUserPage,
}: {
  comments: CommentsData[];
  currentUser: string;
  onUserPage: boolean;
}) {
  useEffect(() => {
    getComments(comments);
  }, []);
  const [commentsList, setComments] = useState<CommentsData[]>([]);

  async function getComments(comments: CommentsData[]) {
    setComments(comments);
  }
  return (
    <div className="flex flex-col gap-4 items-center bg-base-300">
      {commentsList.map((comm: CommentsData, index) => (
        <Comment
          key={index}
          id={comm.id}
          targetId={comm.post.id}
          username={comm.user.username}
          content={comm.content}
          onUserPage={onUserPage}
          currentUser={currentUser}
          date={comm.postedDate}
        />
      ))}
    </div>
  );
}

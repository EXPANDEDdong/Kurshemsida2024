import { useEffect, useState } from "preact/hooks";
import type { CommentData } from "@utils/types";
import Comment from "@components/templates/Comment";
import { commentState } from "~/store";
import { useStore } from "@nanostores/preact";

export default function CommentsFeed({
  comments,
  currentUser,
  onUserPage,
}: {
  comments: CommentData[];
  currentUser: string;
  onUserPage: boolean;
}) {
  const $state = useStore(commentState);
  return (
    <List
      key={$state}
      comments={comments}
      currentUser={currentUser}
      onUserPage={onUserPage}
    />
  );
}

function List({
  comments,
  currentUser,
  onUserPage,
}: {
  comments: CommentData[];
  currentUser: string;
  onUserPage: boolean;
}) {
  useEffect(() => {
    getComments(comments);
  }, []);
  const [commentsList, setComments] = useState<CommentData[]>([]);

  async function getComments(comments: CommentData[]) {
    setComments(comments);
  }

  return (
    <div className="flex flex-col gap-4 items-center bg-base-300">
      {commentsList.map((comm: CommentData, index) => (
        <Comment
          key={index}
          id={comm.id}
          targetId={comm.post.id}
          username={comm.user.username}
          role={comm.user.permissions.role}
          content={comm.content}
          onUserPage={onUserPage}
          currentUser={currentUser}
          date={comm.postedDate}
        />
      ))}
    </div>
  );
}

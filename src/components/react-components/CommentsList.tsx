import { useEffect, useState } from "preact/hooks";
import type { CommentData, userRole } from "@utils/types";
import Comment from "@components/templates/Comment";
import { commentState, newComment } from "~/store";
import { useStore } from "@nanostores/preact";

export default function CommentsFeed({
  comments,
  currentUser,
  currentRole,
  onUserPage,
}: {
  comments: CommentData[];
  currentRole?: userRole;
  currentUser: string;
  onUserPage: boolean;
}) {
  const $state = useStore(commentState);
  return (
    <List
      key={$state}
      comments={comments}
      currentRole={currentRole}
      currentUser={currentUser}
      onUserPage={onUserPage}
    />
  );
}

function List({
  comments,
  currentUser,
  currentRole,
  onUserPage,
}: {
  comments: CommentData[];
  currentRole?: userRole;
  currentUser: string;
  onUserPage: boolean;
}) {
  useEffect(() => {
    getComments(comments);
  }, []);
  const [commentsList, setComments] = useState<CommentData[]>([]);
  const $newComment = useStore(newComment);

  function getComments(comments: CommentData[]) {
    if ($newComment.content !== null && $newComment.targetId !== null) {
      if (!currentRole) return;
      {
        /* This looks a little messy but it allowsto display the latest comment at the top of the comment list without fetching anything again.
      It simply puts the new comment in a nanostore and since the list loads the comment on render, i rerender the component when a new comment is posted
      and if $newComment isnt empty it adds the values of that to the list. */
      }
      const newComm: CommentData[] = [
        {
          id: "newcomm",
          content: $newComment.content,
          post: {
            id: $newComment.targetId,
            content: "null",
            title: "null",
            user: {
              username: "null",
              permissions: {
                role: "user",
              },
            },
            postedDate: new Date(),
          },
          user: {
            username: currentUser,
            permissions: {
              role: currentRole,
            },
          },
          postedDate: new Date(),
        },
      ];
      setComments([...newComm, ...comments]);
      return;
    }
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

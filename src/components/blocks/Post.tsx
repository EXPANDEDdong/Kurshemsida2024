import CommentForm from "@components/CommentForm";
import { useEffect, useState } from "preact/hooks";
import DateTime from "./TimeSince";
import fetchJson from "@utils/fetchJson";

export const checkCurrentUser = (user: string, user2: string): boolean => {
  const isCurrent: boolean = user2 == user;
  return isCurrent;
};

export default function Post({
  id,
  username,
  title,
  content,
  date,
  onFeed,
  currentUser,
}: {
  id: string;
  username: string;
  title: string;
  content: string;
  date: Date;
  onFeed: boolean;
  currentUser: string;
}) {
  useEffect(() => {
    const isTrue = checkCurrentUser(username, currentUser);
    setIsCurrentUser(isTrue);
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const handlePostDelete = async (postId: string) => {
    const body = {
      id: postId,
    };
    console.log(postId);
    await fetchJson("/api/deletepost", {
      method: "DELETE",
      body: JSON.stringify(body),
    });
    return;
  };

  return (
    <div className="py-4 px-6 bg-base-100 rounded-lg shadow-lg w-full relative justify-self-center z-50">
      <a href={`/user/${username}`} className={"w-fit"}>
        {username}
      </a>
      {isCurrentUser && (
        <button
          className={"absolute right-6 top-4 btn btn-error"}
          onClick={() => handlePostDelete(id)}
        >
          delete
        </button>
      )}
      <div className={"w-full h-full relative"}>
        {onFeed && (
          <a href={`/post/${id}`} className={"absolute w-full h-full"}></a>
        )}
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className={"divider"}></div>
        <p className="text-lg">{content}</p>
        <div className={"divider"}></div>
        <p>
          <DateTime value={date} />
        </p>
        {!onFeed && (
          <>
            <div className={"divider"}></div>
            <CommentForm
              postId={id}
              onNewComment={(result) => {
                alert(
                  `Comment posted: ${result.content}\nOn post: ${result.targetId}`
                );
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

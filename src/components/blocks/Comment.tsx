import { useEffect, useState } from "preact/hooks";
import DateTime from "./TimeSince";
import { checkCurrentUser } from "./Post";
import fetchJson from "@utils/fetchJson";

export default function Comment({
  id,
  targetId,
  username,
  content,
  date,
  onUserPage,
  currentUser,
}: {
  id: string;
  targetId: string;
  username: string;
  content: string | null;
  date: Date;
  onUserPage: boolean;
  currentUser: string;
}) {
  useEffect(() => {
    const isTrue = checkCurrentUser(username, currentUser);
    setIsCurrentUser(isTrue);
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const handleCommentDelete = async (commentId: string) => {
    const body = {
      id: commentId,
    };
    // console.log(postId);
    await fetchJson("/api/deletecomment", {
      method: "DELETE",
      body: JSON.stringify(body),
    });
    return;
  };
  return (
    <div className="py-4 px-6 bg-neutral-50 rounded-lg shadow-lg w-11/12 relative">
      {onUserPage ? (
        <>
          <a href={`/post/${targetId}`}>See comment post</a>
          <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
        </>
      ) : null}
      <a href={`/user/${username}`} className={"w-fit"}>
        {username}
      </a>
      {isCurrentUser && (
        <button
          className={
            "absolute right-6 top-4 text-white bg-red-400 hover:bg-red-500 hover:p-2 transition-all rounded-lg p-1"
          }
          onClick={() => handleCommentDelete(id)}
        >
          delete
        </button>
      )}
      <div className={"w-full h-full relative"}>
        <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
        <p className="text-neutral-900 text-lg">{content}</p>
        <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
        <p className={"text-neutral-900 text-sm"}>
          <DateTime value={date} />
        </p>
      </div>
    </div>
  );
}

import { useEffect, useState } from "preact/hooks";
import DateTime from "../blocks/TimeSince";
import { checkCurrentUser } from "./Post";
import fetchJson from "@utils/fetchJson";
import type { CommentProps } from "@utils/types";

export default function Comment({
  id,
  targetId,
  username,
  role,
  content,
  date,
  onUserPage,
  currentUser,
}: CommentProps) {
  useEffect(() => {
    const isTrue = checkCurrentUser(username, currentUser);
    setIsCurrentUser(isTrue);
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const handleCommentDelete = async (commentId: string) => {
    const body = {
      id: commentId,
    };
    await fetchJson("/api/comments/deletecomment", {
      method: "DELETE",
      body: JSON.stringify(body),
    });
    return;
  };
  return (
    <div className="py-4 px-6 bg-base-100 rounded-lg shadow-lg w-11/12 relative flex flex-col">
      {onUserPage ? (
        <>
          <a
            href={`/post/${targetId}`}
            className={"link hover:link-info link-hover"}
          >
            See comment post
          </a>
        </>
      ) : null}
      <a
        href={`/user/${username}`}
        className={`w-fit h-fit text-lg link link-hover ${
          role === "admin" ? "link-warning" : "link-info"
        }`}
      >
        {username}
      </a>
      {isCurrentUser && (
        <button
          className={
            "absolute right-6 top-4 btn btn-error btn-outline h-8 w-14 min-h-0"
          }
          onClick={() => handleCommentDelete(id)}
        >
          delete
        </button>
      )}
      <div className={"w-full h-full relative"}>
        <div className={"divider"}></div>
        <p className="text-lg">{content}</p>
        <div className={"divider"}></div>

        <div className={"btn no-animation w-fit flex flex-row gap-2 mt-2"}>
          <p>
            <DateTime value={date} />
          </p>
        </div>
      </div>
    </div>
  );
}

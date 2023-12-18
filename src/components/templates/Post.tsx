import CommentForm from "@components/react-components/CommentForm";
import { useEffect, useState } from "preact/hooks";
import DateTime from "../blocks/TimeSince";
import fetchJson from "@utils/fetchJson";
import { MessageCircle } from "lucide-preact";
import type { PostProps } from "@utils/types";

export const checkCurrentUser = (user: string, user2: string): boolean => {
  const isCurrent: boolean = user2 == user;
  return isCurrent;
};

export default function Post({
  id,
  username,
  role,
  title,
  content,
  date,
  onFeed,
  currentUser,
  commentCount,
}: PostProps) {
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
    await fetchJson("/api/posts/deletepost", {
      method: "DELETE",
      body: JSON.stringify(body),
    });
    return;
  };

  return (
    <div className="py-4 px-6 bg-base-100 rounded-lg shadow-lg w-full mx-4 relative justify-self-center z-50 flex flex-col gap-2">
      <div className={"justify-between w-full flex flex-row items-center"}>
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
            className={"btn btn-error btn-outline h-8 w-14 min-h-0"}
            onClick={() => handlePostDelete(id)}
          >
            delete
          </button>
        )}
      </div>

      <div className={"w-full h-full relative"}>
        {onFeed && (
          <a href={`/post/${id}`} className={"absolute w-full h-full"}></a>
        )}
        <h3 className="text-3xl font-semibold">{title}</h3>
        <div className={"divider"}></div>
        <p className="text-lg break-words">{content}</p>
        <div className={"divider"}></div>
        <p>
          <DateTime value={date} />
        </p>
        {onFeed && (
          <div className={"btn no-animation w-fit flex flex-row gap-2 mt-2"}>
            <MessageCircle />
            <p>{commentCount}</p>
          </div>
        )}
        {!onFeed && (
          <>
            {/* <div className={"divider"}></div> */}
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

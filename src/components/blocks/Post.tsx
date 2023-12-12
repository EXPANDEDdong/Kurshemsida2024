import CommentForm from "@components/CommentForm";
import { useEffect, useState } from "preact/hooks";
import DateTime from "./TimeSince";
import fetchJson from "@utils/fetchJson";
import type { userRole } from "./User";

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
}: {
  id: string;
  username: string;
  role: userRole;
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
    <div className="py-4 px-6 bg-base-100 rounded-lg shadow-lg w-11/12 relative justify-self-center z-50 flex flex-col gap-2">
      <div className={"justify-between w-full flex flex-row items-center"}>
        <a
          href={`/user/${username}`}
          className={`w-fit h-fit text-lg badge ${
            role === "admin" ? "badge-warning" : "badge-info"
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

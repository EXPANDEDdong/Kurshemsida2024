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
    <div className="py-4 px-6 bg-neutral-50 rounded-lg shadow-lg w-11/12 relative justify-self-center">
      <a href={`/user/${username}`} className={"w-fit"}>
        {username}
      </a>
      {isCurrentUser && (
        <button
          className={
            "absolute right-6 top-4 text-white bg-red-400 hover:bg-red-500 hover:p-2 transition-all rounded-lg p-1"
          }
          onClick={() => handlePostDelete(id)}
        >
          delete
        </button>
      )}
      <div className={"w-full h-full relative"}>
        {onFeed && (
          <a href={`/post/${id}`} className={"absolute w-full h-full"}></a>
        )}
        <h3 className="text-2xl text-neutral-900 font-semibold">{title}</h3>
        <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
        <p className="text-neutral-900 text-lg">{content}</p>
        <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
        <p>
          <DateTime value={date} />
        </p>
        {!onFeed && (
          <>
            <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
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

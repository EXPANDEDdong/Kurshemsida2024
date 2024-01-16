import CommentForm from "@components/react-components/CommentForm";
import { useEffect, useState } from "preact/hooks";
import DateTime from "../blocks/TimeSince";
import fetchJson from "@utils/fetchJson";
import { MessagesSquare } from "lucide-preact";

import type { PostProps } from "@utils/types";
import { createRef } from "preact";

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
  const ref = createRef();

  const openConfirm = () => {
    if (ref.current) {
      ref.current.showModal();
    }
  };

  const closeConfirm = () => {
    if (ref.current) {
      ref.current.close();
    }
  };

  const handlePostDelete = async (postId: string) => {
    const body = {
      id: postId,
    };
    await fetchJson("/api/posts/deletepost", {
      method: "DELETE",
      body: JSON.stringify(body),
    });
  };

  return (
    <div className="relative z-50 flex flex-col w-full gap-2 px-6 py-4 rounded-lg shadow-lg bg-base-100 justify-self-center">
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
            onClick={openConfirm}
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
        <div className={"flex flex-row justify-between"}>
          <div className={"flex flex-row gap-2"}>
            <div className={"btn no-animation w-fit flex flex-row gap-2 mt-2"}>
              <p>
                <DateTime value={date} />
              </p>
            </div>
            {onFeed && (
              <div
                className={"btn no-animation w-fit flex flex-row gap-2 mt-2"}
              >
                <MessagesSquare />
                <p>{commentCount}</p>
              </div>
            )}
          </div>
          {!onFeed && (
            <>
              <CommentForm postId={id} />
            </>
          )}
        </div>
      </div>
      {isCurrentUser && (
        <dialog ref={ref} className={"modal"}>
          <div className={"modal-box"}>
            <div className={"w-full h-full 1flex flex-col gap-4 p-4"}>
              <h4 className={"text-center text-xl font-semibold"}>
                Are you sure you want to delete?
              </h4>
              <div className={"divider"}></div>
              <button
                className={"btn btn-block btn-error"}
                onClick={() => handlePostDelete(id)}
              >
                Confirm Delete
              </button>
            </div>
          </div>
          <button className={"modal-backdrop"} onClick={closeConfirm}></button>
        </dialog>
      )}
    </div>
  );
}

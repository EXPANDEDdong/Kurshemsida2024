import CommentForm from "@components/react-components/CommentForm";
import { useEffect, useState } from "preact/hooks";
import DateTime from "../blocks/TimeSince";
import fetchJson from "@utils/fetchJson";
import { MessagesSquare, X } from "lucide-preact";

import type { PostData, PostProps } from "@utils/types";
import { createRef } from "preact";
import CommentAdminPage from "./CommentAdminPage";

export const checkCurrentUser = (user: string, user2: string): boolean => {
  const isCurrent: boolean = user2 == user;
  return isCurrent;
};

export default function PostAdminPage({
  id,
  username,
  role,
  title,
  content,
  date,
  comments,
  onFeed,
  commentCount,
}: Omit<PostProps, "currentUser"> & {
  comments: any[];
}) {
  const confirmRef = createRef();
  const postRef = createRef();

  const openConfirm = () => {
    if (confirmRef.current) {
      confirmRef.current.showModal();
    }
  };

  const closeConfirm = () => {
    if (confirmRef.current) {
      confirmRef.current.close();
    }
  };

  const openPost = () => {
    if (postRef.current) {
      postRef.current.showModal();
    }
  };

  const closePost = () => {
    if (postRef.current) {
      postRef.current.close();
    }
  };

  const handlePostDelete = async (postId: string) => {
    const body = {
      id: postId,
    };
    await fetchJson("/api/admin/force-deletepost", {
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
        <div className={"flex flex-row gap-4"}>
          <button
            className={"btn btn-error btn-outline h-8 w-14 min-h-0"}
            onClick={openConfirm}
          >
            delete
          </button>
          <button
            className={"btn btn-warning btn-outline h-8 w-24 min-h-0 px-8"}
            onClick={openPost}
          >
            manage comments
          </button>
        </div>
      </div>

      <div className={"w-full h-full relative"}>
        <a href={`/post/${id}`} className={"absolute w-full h-full"}></a>
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

            <div className={"btn no-animation w-fit flex flex-row gap-2 mt-2"}>
              <MessagesSquare />
              <p>{commentCount}</p>
            </div>
          </div>
        </div>
      </div>

      <dialog ref={postRef} className={"modal"}>
        <div
          className={"modal-box modal-scroll md:w-8/12 max-w-full bg-base-200"}
        >
          <div className={"w-full flex flex-col"}>
            <div className={"w-full flex flex-row justify-between"}>
              <div className={"flex flex-row gap-4 flex-wrap items-center"}>
                <h4 className={"text-xl"}>Post by {username}</h4>
                <span
                  className={`badge badge-outline ${
                    role === "admin" ? "badge-warning" : "badge-info"
                  }`}
                >
                  {role}
                </span>
              </div>
              <button
                onClick={closePost}
                className={"btn btn-circle btn-outline"}
              >
                <X />
              </button>
            </div>
            <div className={"divider"}></div>
            <div className={"w-full flex flex-col flex-wrap gap-4 mb-4"}>
              <h3 className="text-3xl font-semibold">{title}</h3>
              <p className="text-lg break-words">{content}</p>
            </div>
            <div className={"divider"}></div>
            <h4 className={"text-lg mb-2 font-semibold"}>Comments</h4>
            <div
              className={
                "rounded-lg border-base-100 border-2 h-80 overflow-auto no-scrollbars flex flex-col gap-4 items-center p-4"
              }
            >
              {comments.map((comm, index) => (
                <CommentAdminPage
                  key={index}
                  content={comm.content}
                  date={comm.postedDate}
                  id={comm.id}
                  role={comm.user.permissions.role}
                  username={comm.user.username}
                />
              ))}
              <p className={"text-lg my-4"}>No More Comments</p>
            </div>
          </div>
        </div>
        <button className={"modal-backdrop"} onClick={closePost}></button>
      </dialog>

      <dialog ref={confirmRef} className={"modal"}>
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
    </div>
  );
}

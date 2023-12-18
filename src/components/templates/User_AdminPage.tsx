import type { UserProps, userRole } from "@utils/types";
import { createRef } from "preact";
import { useState } from "preact/hooks";
import { X } from "lucide-preact";

export default function User_AdminPage({
  id,
  email,
  username,
  description,
  role,
}: UserProps) {
  const dialogRef = createRef();

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <div className="relative z-50 w-11/12 px-6 py-4 rounded-lg shadow-lg bg-base-100 justify-self-center">
      <div
        className={"h-full w-full flex flex-row gap-4 justify-between relative"}
      >
        <div className={"w-full flex flex-row gap-4 flex-wrap items-center"}>
          {/* <h4 className={"text-xl"}>{id}</h4>
          <div className={"divider divider-horizontal"}></div> */}
          <h4 className={"text-xl"}>{username}</h4>
          <span
            className={`badge badge-outline ${
              role === "admin" ? "badge-warning" : "badge-info"
            }`}
          >
            {role}
          </span>
        </div>
        <button onClick={openModal} className={"btn btn-outline btn-success"}>
          Manage
        </button>
      </div>
      <dialog ref={dialogRef} className={"modal"}>
        <div className={"modal-box md:w-8/12 max-w-full bg-base-200"}>
          <div className={"w-full h-full flex flex-col"}>
            <div className={"w-full flex flex-row justify-between"}>
              <div className={"flex flex-row gap-4 flex-wrap items-center"}>
                <h4 className={"text-xl"}>{username}</h4>
                <span
                  className={`badge badge-outline ${
                    role === "admin" ? "badge-warning" : "badge-info"
                  }`}
                >
                  {role}
                </span>
              </div>
              <button
                onClick={closeModal}
                className={"btn btn-circle btn-outline"}
              >
                <X />
              </button>
            </div>
            <div className={"divider"}></div>
            <div className={"w-full flex flex-row flex-wrap gap-2 mb-4"}>
              <div className={"flex flex-col w-full"}>
                <label htmlFor="id" className="block mb-1 text-sm font-bold">
                  ID
                </label>
                <p className={"text-lg break-words"}>{id}</p>
              </div>
              <div className={"flex flex-col w-full"}>
                <label htmlFor="id" className="block mb-1 text-sm font-bold">
                  E-Mail
                </label>
                <p className={"text-lg break-words"}>{email}</p>
              </div>
            </div>
            <div className={"flex flex-col w-full bg-base-100 rounded-lg p-2"}>
              <label htmlFor="id" className="block mb-1 text-sm font-bold">
                Description
              </label>
              <p className={"text-lg break-words"}>{description}</p>
            </div>
          </div>
        </div>
        <button onClick={closeModal} className={"modal-backdrop"}></button>
      </dialog>
    </div>
  );
}

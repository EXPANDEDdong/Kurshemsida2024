import type { UserProps } from "@utils/types";
import { createRef } from "preact";
import { X } from "lucide-preact";
import { useState } from "preact/hooks";
import fetchJson from "@utils/fetchJson";

export default function UserAdminPage({
  id,
  email,
  username,
  description,
  role,
}: UserProps) {
  const dialogRef = createRef();

  const [updateUser, setUpdateUser] = useState({
    username: "",
    description: "",
  });

  const handleDeleteUser = async (userId: string) => {
    const body = {
      id: userId,
    };
    const result = await fetchJson("/api/admin/force-deleteuser", {
      method: "DELETE",
      body: JSON.stringify(body),
    });
  };

  const handleInput = (e: any) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async (userId: string) => {
    const body = {
      ...updateUser,
      id: userId,
    };
    const result = await fetchJson("/api/admin/force-updateuser", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  };

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
    <div
      className={
        "relative z-50 w-full px-6 py-4 rounded-lg shadow-lg bg-base-100 justify-self-center"
      }
    >
      <div
        className={"h-full w-full flex flex-row gap-4 justify-between relative"}
      >
        <div className={"w-full flex flex-row gap-4 flex-wrap items-center"}>
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
        <div
          className={"modal-box modal-scroll md:w-8/12 max-w-full bg-base-200"}
        >
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
                <label htmlFor={"id"} className="block mb-1 text-sm font-bold">
                  ID
                </label>
                <p id={"id"} className={"text-lg break-words"}>
                  {id}
                </p>
              </div>
              <div className={"flex flex-col w-full"}>
                <label
                  htmlFor={"email"}
                  className={"block mb-1 text-sm font-bold"}
                >
                  E-Mail
                </label>
                <p id={"email"} className={"text-lg break-words"}>
                  {email}
                </p>
              </div>
            </div>
            <div className={"flex flex-col w-full bg-base-100 rounded-lg p-2"}>
              <label
                htmlFor={"description"}
                className="block mb-1 text-sm font-bold"
              >
                Description
              </label>
              <p id={"description"} className={"text-lg break-words"}>
                {description}
              </p>
            </div>
            <div className={"divider"}></div>

            <div
              className={
                "p-2 w-full flex flex-col gap-4 rounded-lg border border-warning"
              }
            >
              <h4 className={"font-semibold text-xl"}>Update User</h4>
              <div className={"flex flex-col gap-2 w-full"}>
                <div className={"w-full"}>
                  <label
                    className="block text-sm font-bold mb-1"
                    htmlFor="username"
                  >
                    New username:
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={updateUser.username}
                    onInput={handleInput}
                    placeholder={"User username"}
                    className={"input input-bordered w-full"}
                  />
                </div>
                <div className={"w-full"}>
                  <label
                    className="block text-sm font-bold mb-1"
                    htmlFor="description"
                  >
                    New description:
                  </label>
                  <textarea
                    name="description"
                    value={updateUser.description}
                    onInput={handleInput}
                    placeholder={"User description"}
                    className={"resize-none textarea textarea-bordered w-full"}
                  />
                </div>
                <div className={"divider"}></div>
                <button
                  className={"btn btn-block btn-warning btn-outline"}
                  onClick={() => handleUpdateUser(id)}
                >
                  Update User
                </button>
              </div>
            </div>
            <div className={"divider"}></div>
            <div className={"w-full"}>
              <button
                className={"btn btn-block btn-error btn-outline"}
                onClick={() => handleDeleteUser(id)}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
        <button onClick={closeModal} className={"modal-backdrop"}></button>
      </dialog>
    </div>
  );
}

import fetchJson from "@utils/fetchJson";
import { useState } from "preact/hooks";

export default function UpdateUser() {
  const [user, setUser] = useState({ username: "", description: "" });

  const handleInput = (e: any) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const body = user;
    const result = await fetchJson("/api/users/updateuser", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    setUser({ username: "", description: "" });
  };
  return (
    <div
      className={
        "p-2 w-full flex flex-col gap-4 rounded-lg border border-warning"
      }
    >
      <h4 className={"font-semibold text-xl"}>Update User</h4>
      <form onSubmit={handleSubmit}>
        <div className={"flex flex-col gap-2 w-full"}>
          <div className={"w-full"}>
            <label className="block text-sm font-bold mb-1" htmlFor="username">
              New username:
            </label>
            <input
              type="text"
              name="username"
              value={user.username}
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
              value={user.description}
              onInput={handleInput}
              placeholder={"User description"}
              className={"resize-none textarea textarea-bordered w-full"}
            />
          </div>
          <div className={"divider"}></div>
          <button
            className={"btn btn-block btn-warning btn-outline"}
            type={"submit"}
          >
            Update User
          </button>
        </div>
      </form>
    </div>
  );
}

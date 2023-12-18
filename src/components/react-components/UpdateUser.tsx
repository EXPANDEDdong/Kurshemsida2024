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
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const body = user;
    const result = await fetchJson("/api/users/updateuser", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  };
  return (
    <div
      className={"flex flex-col gap-4 h-full w-full bg-base-100 rounded-lg p-8"}
    >
      <h4 className={"text-xl font-semibold"}>Update user info</h4>
      <form onSubmit={handleSubmit}>
        <div className={"h-full w-full flex flex-col gap-4"}>
          <div className={"flex flex-col gap-1"}>
            <label className="block text-sm font-bold mb-1" htmlFor="username">
              Username: {user.username}
            </label>
            <input
              type="text"
              id={"username"}
              name="username"
              value={user.username}
              onInput={handleInput}
              className={"input input-bordered"}
              placeholder={"Username"}
            />
          </div>
          <div className={"flex flex-col gap-1"}>
            <label className="block text-sm font-bold mb-1" htmlFor="bio">
              Description: {user.description}
            </label>
            <textarea
              name="description"
              id={"bio"}
              value={user.description}
              onInput={handleInput}
              className={"textarea textarea-bordered resize-none"}
              maxLength={150}
              placeholder={"Bio"}
            />
            <p className="block text-sm font-bold mb-1">
              {user.description.length}/150
            </p>
          </div>
          <button type={"submit"} className={"btn btn-info"}>
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

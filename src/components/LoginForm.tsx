import fetchJson from "@utils/fetchJson";
import { useState } from "preact/hooks";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleUsernameInput = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const body = {
      username: username,
      password: password,
    };
    try {
      const result = await fetchJson("/api/loginuser", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="py-4 px-6 w-full bg-neutral-50 rounded-lg shadow-lg">
      <h4 className="text-xl">Create account</h4>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center w-full gap-3 my-2">
          <div className="w-11/12">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="username"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onInput={handleUsernameInput}
              className="w-full bg-neutral-50 border shadow-sm border-neutral-400 rounded-lg h-10 text-neutral-900 focus:outline-none focus:border focus:border-neutral-500 px-2"
              placeholder={"Username here."}
              required
            />
          </div>
          <div className="w-11/12">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="password"
            >
              Password: {password}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onInput={handlePasswordInput}
              className="w-full bg-neutral-50 border shadow-sm border-neutral-400 rounded-lg h-10 text-neutral-900 focus:outline-none focus:border focus:border-neutral-500 px-2"
              placeholder={"Password here."}
              required
            />
          </div>
        </div>
        <hr className="my-6 bg-neutral-200 text-neutral-200 border-neutral-200" />
        <div className="w-full text-center">
          <a href={`/create`}>Create account instead.</a>
        </div>
        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="p-2 text-white h-12 w-24 text-center bg-blue-500 rounded-lg shadow-lg hover:bg-blue-400 active:bg-blue-600 active:shadow-sm active:w-[5.5rem] transition-all"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

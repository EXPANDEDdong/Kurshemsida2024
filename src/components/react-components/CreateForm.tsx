import fetchJson from "@utils/fetchJson";
import { useState } from "preact/hooks";
import { XCircle } from "lucide-preact";

export default function CreateForm() {
  const [user, setUser] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState({ isError: false, message: "" });

  const handleInput = (e: any) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const body = {
      email: user.email,
      username: user.username,
      password: user.password,
    };
    try {
      const result = await fetchJson<{ success: boolean; message: string }>(
        "/api/users/createuser",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      if (!result) {
        setError({ isError: true, message: "Unknown Error." });
        return;
      }

      if (!result.success) {
        setError({ isError: true, message: result.message });
        return;
      }

      window.location.replace(window.location.origin);
      return;
    } catch (error) {
      console.error("Error submitting form:", error);

      if (!(error instanceof Error)) {
        setError({ isError: true, message: "Unknown Error." });
        return;
      }
      setError({ isError: true, message: error.message });
      return;
    }
  };

  return (
    <div className="py-4 px-6 w-full bg-base-100 rounded-lg shadow-lg">
      <h4 className="text-3xl mb-2">Create account</h4>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center w-full gap-3 my-2">
          <div className="w-11/12">
            <label
              className="block text-base-content text-sm font-bold mb-1"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onInput={handleInput}
              className="w-full input input-bordered"
              placeholder={"E-mail here."}
              required
            />
          </div>
          <div className="w-11/12">
            <label
              className="block text-base-content text-sm font-bold mb-1"
              htmlFor="username"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onInput={handleInput}
              className="w-full input input-bordered"
              placeholder={"Username here."}
              required
            />
          </div>
          <div className="w-11/12">
            <label
              className="block text-base-content text-sm font-bold mb-1"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onInput={handleInput}
              className="w-full input input-bordered"
              placeholder={"Password here."}
              required
            />
          </div>
        </div>
        <div className={"divider"}></div>
        <div className="w-full text-center my-2">
          <a href={`/login`} className={"btn btn-sm btn-ghost"}>
            I already have an account.
          </a>
        </div>
        <div className="flex justify-center w-full">
          <button
            type="submit"
            className={`btn btn-block transition-all duration-700 ease-in-out ${
              !error.isError
                ? "btn-success text-success-content"
                : "btn-error text-error-content animate-pulse"
            }`}
          >
            {!error.isError ? (
              <>Create</>
            ) : (
              <>
                <XCircle />
                {error.message} Please refresh and try again
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

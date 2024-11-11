import fetchJson from "@utils/fetchJson";
import { XCircle } from "lucide-preact";
import { useState } from "preact/hooks";

export default function LoginForm() {
  const [user, setUser] = useState({ email: "", password: "" });
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
      password: user.password,
    };
    try {
      const result = await fetchJson<{ success: boolean; message: string }>(
        "/api/users/loginuser",
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
      <h4 className="text-3xl mb-2">Log In</h4>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center w-full gap-3 my-2">
          <div className="w-11/12">
            <label
              className="block text-base-content text-sm font-bold mb-1"
              htmlFor="username"
            >
              E-mail:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
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
          <a href={`/create`} className={"btn btn-sm btn-ghost"}>
            I want to create an account.
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
              <>Log In</>
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

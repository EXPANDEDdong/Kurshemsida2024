import fetchJson from "@utils/fetchJson";
import { useState } from "preact/hooks";

export default function Login() {
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
      const result = await fetchJson("/api/createuser", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <p>{username}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onInput={handleUsernameInput}
          required
        />
        <p>{password}</p>
        <input
          type="text"
          value={password}
          onInput={handlePasswordInput}
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

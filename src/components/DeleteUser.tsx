import fetchJson from "@utils/fetchJson";
import { useState } from "preact/hooks";

export default function DeleteUser() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [didConfirm, setDidConfirm] = useState(false);

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const body = {
      email: email,
      password: password,
    };
    await fetchJson("/api/deleteuser", {
      method: "DELETE",
      body: JSON.stringify(body),
    });
  };
  return (
    <div>
      <button onClick={() => setDidConfirm(didConfirm ? false : true)}>
        {didConfirm ? "cancel" : "delete"}
      </button>
      {didConfirm && (
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onInput={handleEmailInput} />
          <input
            type="text"
            name=""
            value={password}
            onInput={handlePasswordInput}
          />
          <button type="submit">Delete Account</button>
        </form>
      )}
    </div>
  );
}

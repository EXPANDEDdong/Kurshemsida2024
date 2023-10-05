import { useState } from "preact/hooks";
import { JWT } from "jose";
import * as bcrypt from "bcrypt";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleUsernameInput = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };
  return (
    <div>
      <form>
        <input type="text" value={username} onInput={handleUsernameInput} />
        <input type="text" value={password} onInput={handlePasswordInput} />
      </form>
    </div>
  );
}

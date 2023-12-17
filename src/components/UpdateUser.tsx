import fetchJson from "@utils/fetchJson";
import { useState } from "preact/hooks";

export default function UpdateUser() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleBio = (e) => {
    setBio(e.target.value);
  };
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const body = {
      username: username,
      description: bio,
    };
    const result = await fetchJson("/api/updateuser", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>{username}</p>
        <input
          type="text"
          name="username"
          value={username}
          onInput={handleUsername}
          placeholder={"name"}
        />
        <p>{bio}</p>
        <textarea
          name="bio"
          value={bio}
          onInput={handleBio}
          placeholder={"bio"}
        />
        <button type={"submit"}>Submit</button>
      </form>
    </div>
  );
}

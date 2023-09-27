import fetchJson from "@utils/fetchJson";
import { useState } from "preact/hooks";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleInputTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleContentTitle = (e) => {
    setContent(e.target.value);
  };
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (title != "" && content != "") {
      const body = {
        title: title,
        content: content,
      };
      try {
        const response = fetchJson("/api/posts", {
          method: "POST",
          body: JSON.stringify(body),
        });
        const result = await response;
        console.log(result);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
      setTitle("");
      setContent("");
    } else {
      alert("Both fields must be filled");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>please: {title}</p>
        <input
          type="text"
          value={title}
          onInput={handleInputTitle}
          className="border border-black"
          required
        />
        <p>please: {content}</p>
        <input
          type="text"
          value={content}
          onInput={handleContentTitle}
          className="border border-black"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

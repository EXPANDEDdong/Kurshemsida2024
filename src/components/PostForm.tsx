import fetchJson from "@utils/fetchJson";
import { useState } from "preact/hooks";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleInputTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleInputContent = (e) => {
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
        const result = await fetchJson("/api/posts", {
          method: "POST",
          body: JSON.stringify(body),
        });
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
        <p>Title: {title}</p>
        <input
          type="text"
          value={title}
          onInput={handleInputTitle}
          className="border border-black"
          required
        />
        <p>Content: {content}</p>
        <input
          type="text"
          value={content}
          onInput={handleInputContent}
          className="border border-black"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

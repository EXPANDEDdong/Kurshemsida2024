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
          headers: {
            credentials: "include",
          },
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
    <div className="py-4 px-6 w-full h-full bg-base-100 rounded-lg shadow-lg">
      <h4 className="text-xl text-neutral-100 font-semibold">Make post</h4>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center w-full gap-3 my-2">
          <div className="w-11/12">
            <label
              className="block text-gray-400 text-sm font-bold mb-1"
              htmlFor="title"
            >
              Title:
            </label>
            <input
              type="text"
              id={"title"}
              value={title}
              onInput={handleInputTitle}
              className="w-full input input-bordered"
              placeholder={"Post title here."}
              required
            />
          </div>
          <div className="w-11/12">
            <label
              className="block text-gray-400 text-sm font-bold mb-1"
              htmlFor="content"
            >
              Content:
            </label>
            <textarea
              id={"content"}
              value={content}
              onInput={handleInputContent}
              className="w-full textarea textarea-bordered resize-none"
              placeholder={"Post content here."}
              required
            />
          </div>
        </div>
        <div className="divider"></div>
        <div className="flex justify-center w-full">
          <button type="submit" className="btn btn-secondary btn-block">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

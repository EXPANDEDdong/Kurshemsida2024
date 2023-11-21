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
    <div className="py-4 px-6 w-full bg-neutral-50 rounded-lg shadow-lg">
      <h4 className="text-xl text-neutral-900 font-semibold">Make post</h4>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center w-full gap-3 my-2">
          <div className="w-11/12">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="title"
            >
              Title:
            </label>
            <input
              type="text"
              id={"title"}
              value={title}
              onInput={handleInputTitle}
              className="w-full bg-neutral-50 border shadow-sm border-neutral-400 rounded-lg h-10 text-neutral-900 focus:outline-none focus:border focus:border-neutral-500 px-2"
              placeholder={"Post title here."}
              required
            />
          </div>
          <div className="w-11/12">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="content"
            >
              Content:
            </label>
            <textarea
              id={"content"}
              value={content}
              onInput={handleInputContent}
              className="w-full bg-neutral-50 resize-none border shadow-sm border-neutral-400 rounded-lg h-24 text-neutral-900 focus:outline-none focus:border focus:border-neutral-500 px-2"
              placeholder={"Post content here."}
              required
            />
          </div>
        </div>
        <hr className="my-6 bg-neutral-200 text-neutral-200 border-neutral-200" />
        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="p-2 text-white h-12 w-24 text-center bg-blue-500 rounded-lg shadow-lg hover:bg-blue-400 active:bg-blue-600 active:shadow-sm active:w-[5.5rem] transition-all"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

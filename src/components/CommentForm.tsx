import fetchJson from "@utils/fetchJson";
import { useState } from "preact/hooks";

export default function CommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");

  const handleInput = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (event: SubmitEvent) => {
    const body = {
      content: content,
      targetId: postId,
    };
    const result = await fetchJson("/api/createcomment", {
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  return (
    <div className={"w-full"}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row w-full gap-3 my-2">
          <div className="w-full grow">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="content"
            >
              Comment:
            </label>
            <textarea
              id={"content"}
              value={content}
              onInput={handleInput}
              className="w-full bg-neutral-50 resize-none border shadow-sm border-neutral-400 rounded-lg h-24 text-neutral-900 focus:outline-none focus:border focus:border-neutral-500 px-2"
              placeholder={"Comment here."}
              required
            />
          </div>
          <div className="grow-0 h-full self-center">
            <button
              type="submit"
              className="p-2 text-white h-20 w-24 text-center bg-blue-500 rounded-lg shadow-lg hover:bg-blue-400 active:bg-blue-600 active:shadow-sm active:w-[5.5rem] transition-all"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

import fetchJson from "@utils/fetchJson";
import { useState } from "preact/hooks";

export default function CommentForm({
  postId,
  onNewComment,
}: {
  postId: string;
  onNewComment: (comment: { content: string; targetId: string }) => void;
}) {
  const [content, setContent] = useState("");

  const handleInput = (e: any) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const body = {
      content: content,
      targetId: postId,
    };
    const result = await fetchJson("/api/createcomment", {
      method: "POST",
      body: JSON.stringify(body),
    });
    onNewComment(result);
  };

  return (
    <div className={"w-full mt-6"}>
      <form onSubmit={handleSubmit}>
        <label
          className="block text-gray-400 text-sm font-bold mb-1"
          htmlFor="comment"
        >
          Comment:
        </label>
        <div className="flex h-20 flex-row w-full gap-3 my-2" id={"comment"}>
          <div className="w-full grow">
            <textarea
              value={content}
              onInput={handleInput}
              className="w-full textarea textarea-bordered resize-none h-full"
              placeholder={"Comment here."}
              required
            />
          </div>
          <div className="grow-0 h-full self-center">
            <button type="submit" className="btn btn-primary h-full">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

import fetchJson from "@utils/fetchJson";
import { createRef } from "preact";
import { useState } from "preact/hooks";
import { MessagesSquare, PlusCircle } from "lucide-preact";

export default function CommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");

  const dialogRef = createRef();

  const handleInput = (e: any) => {
    setContent(e.target.value);
  };

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const body = {
      content: content,
      targetId: postId,
    };
    const result = await fetchJson("/api/comments/createcomment", {
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  return (
    <div>
      <button
        onClick={openDialog}
        className={
          "btn btn-success z-600 text-success-content w-fit flex flex-row gap-2 mt-2"
        }
      >
        <MessagesSquare />
        Comment
      </button>

      <dialog ref={dialogRef} className={"modal"}>
        <div className={"modal-box"}>
          <h4 className={"text-xl font-semibold mb-4"}>New Comment</h4>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  htmlFor="content"
                >
                  Content:
                </label>
                <textarea
                  id={"content"}
                  value={content}
                  name="content"
                  onInput={handleInput}
                  className="w-full textarea textarea-bordered resize-none"
                  placeholder={"Comment text here."}
                  required
                />
              </div>
              <div className="divider"></div>
              <button
                type="submit"
                className="btn btn-success text-success-content btn-block"
              >
                <PlusCircle />
                Comment
              </button>
            </div>
          </form>
        </div>

        <button onClick={closeDialog} className="modal-backdrop"></button>
      </dialog>
    </div>
  );
}

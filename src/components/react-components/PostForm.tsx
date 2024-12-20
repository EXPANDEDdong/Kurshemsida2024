import fetchJson from "@utils/fetchJson";
import { createRef } from "preact";
import { useState } from "preact/hooks";
import { MessageSquarePlus, PlusCircle } from "lucide-preact";
import { mainFeedState } from "~/store";

export default function PostForm() {
  const [post, setPost] = useState({ title: "", content: "" });

  const dialogRef = createRef();

  const handleInput = (e: any) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (post.title != "" && post.content != "") {
      try {
        const result = await fetchJson("/api/posts/createpost", {
          method: "POST",
          body: JSON.stringify(post),
        });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
      setPost({ title: "", content: "" });
      if (dialogRef.current) {
        dialogRef.current.close();
      }

      mainFeedState.set(Math.random());
    } else {
      alert("Both fields must be filled");
    }
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

  return (
    <div>
      <button
        onClick={openDialog}
        className={
          "btn btn-circle btn-success btn-lg z-600 text-success-content"
        }
      >
        <MessageSquarePlus />
      </button>

      <dialog ref={dialogRef} className={"modal"}>
        <div className={"modal-box"}>
          <h4 className={"text-xl font-semibold mb-4"}>Create new post</h4>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold mb-1" htmlFor="title">
                  Title:
                </label>
                <input
                  type="text"
                  id={"title"}
                  name="title"
                  value={post.title}
                  onInput={handleInput}
                  className="w-full input input-bordered"
                  placeholder={"Post title here."}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  htmlFor="content"
                >
                  Content:
                </label>
                <textarea
                  id={"content"}
                  value={post.content}
                  name="content"
                  onInput={handleInput}
                  className="w-full textarea textarea-bordered resize-none"
                  placeholder={"Post content here."}
                  required
                />
              </div>
              <div className="divider"></div>
              <button
                type="submit"
                className="btn btn-success text-success-content btn-block"
              >
                <PlusCircle />
                Post
              </button>
            </div>
          </form>
        </div>

        <button onClick={closeDialog} className="modal-backdrop"></button>
      </dialog>
    </div>
  );
}

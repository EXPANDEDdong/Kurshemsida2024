import CommentForm from "@components/CommentForm";

export default function Post({
  id,
  username,
  title,
  content,
  onFeed,
}: {
  id: string;
  username: string;
  title: string;
  content: string;
  onFeed: boolean;
}) {
  return (
    <div className="py-4 px-6 bg-neutral-50 rounded-lg shadow-lg w-11/12 relative justify-self-center">
      <a href={`/user/${username}`} className={"w-fit"}>
        {username}
      </a>
      <div className={"w-full h-full relative"}>
        {onFeed ? (
          <a href={`/post/${id}`} className={"absolute w-full h-full"}></a>
        ) : null}
        <h3 className="text-2xl text-neutral-900 font-semibold">{title}</h3>
        <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
        <p className="text-neutral-900 text-lg">{content}</p>
        {!onFeed ? (
          <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
        ) : null}

        {!onFeed ? <CommentForm postId={id} /> : null}
      </div>
    </div>
  );
}

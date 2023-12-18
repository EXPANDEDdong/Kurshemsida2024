import type { userRole } from "@utils/types";

export default function User({
  username,
  bio,
  role,
}: {
  username: string;
  bio: string;
  role: userRole;
}) {
  return (
    <div className="py-4 px-6 bg-base-100 rounded-lg shadow-lg w-11/12 relative justify-self-center z-50">
      <div className={"h-full w-full flex flex-col relative"}>
        <a href={`/user/${username}`} className={"w-full h-full absolute"}></a>
        <div className={"w-full flex flex-row gap-4 items-center"}>
          <h4 className={"text-xl"}>{username}</h4>
          <span
            className={`badge badge-outline ${
              role === "admin" ? "badge-warning" : "badge-info"
            }`}
          >
            {role}
          </span>
        </div>
        <div className={"divider"}></div>
        <p>{bio}</p>
      </div>
    </div>
  );
}

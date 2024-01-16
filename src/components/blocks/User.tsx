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
      <p>{username}</p>
      <p>{bio}</p>
      <p>{role}</p>
    </div>
  );
}

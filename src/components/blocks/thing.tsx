import { useEffect, useState } from "preact/hooks";

interface Users {
  id: string;
  email: string | null;
  username: string;
  description: string | null;
  permissions: {
    role: "user" | "admin";
  };
}

export default function Thing({ thing }: { thing: Users[] }) {
  useEffect(() => {
    setUsers(thing);
  });
  const [users, setUsers] = useState<Users[]>([]);

  return (
    <div>
      {users.map((user, index) => (
        <div
          className="flex flex-row text-text-50 gap-2 bg-neutral-200 p-4 w-full"
          key={index}
        >
          <p>{user.id}</p>
          <p>{user.email}</p>
          <p>{user.username}</p>
          <p>{user.description}</p>
          <p>{user.permissions.role}</p>
        </div>
      ))}
    </div>
  );
}

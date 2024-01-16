import type { userRole } from "@utils/types";
import { Home, Search, Shield, User, Cog } from "lucide-preact";

export default function SideMenu({
  username,
  role,
}: {
  username: string;
  role: userRole;
}) {
  return (
    <div className={"flex flex-col gap-4 mr-4 pt-2"}>
      <a href={"/"} className={"px-8 py-4 btn btn-block h-fit"}>
        <Home />
        Home
      </a>
      <a href={"/search"} className={"px-8 py-4 btn btn-block h-fit"}>
        <Search />
        Search
      </a>
      {role === "admin" && (
        <a href={"/admin"} className={"px-8 py-4 btn btn-block h-fit"}>
          <Shield />
          Admin
        </a>
      )}
      <a href={`/user/${username}`} className={"px-8 py-4 btn btn-block h-fit"}>
        <User />
        My Page
      </a>
      <a href={`/settings`} className={"px-8 py-4 btn btn-block h-fit"}>
        <Cog />
        Settings
      </a>
    </div>
  );
}

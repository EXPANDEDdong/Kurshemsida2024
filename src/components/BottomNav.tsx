import { useEffect, useState } from "preact/hooks";
import { Home, Search, User } from "lucide-preact";

export default function BottomNav({
  path,
  user,
}: {
  path: string;
  user: string;
}) {
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 900;
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  if (width < breakpoint) {
    return (
      <div className="w-full btm-nav z-300">
        <a href="/" className={path === "/" ? "active" : ""}>
          <Home />
        </a>
        <a href="/search" className={path === "/search" ? "active" : ""}>
          <Search />
        </a>
        <a
          href={`/user/${user}`}
          className={path.includes(`/user/${user}`) ? "active" : ""}
        >
          <User />
        </a>
      </div>
    );
  }
  return null;
}

import { useEffect, useState } from "preact/hooks";
import { Newspaper } from "lucide-preact";

export default function Test() {
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 800;
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  if (width < breakpoint) {
    return (
      <div className="w-full btm-nav">
        <a href="/" className={"active"}>
          <Newspaper />
        </a>
        <a href="/">
          <Newspaper />
        </a>
        <a href="/">
          <Newspaper />
        </a>
      </div>
    );
  }
  return null;
}

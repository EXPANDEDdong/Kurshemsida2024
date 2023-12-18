import { useEffect, useState } from "preact/hooks";

export default function ShowOnMobile(props: { children: any }) {
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
    return <>{props.children}</>;
  }
  return null;
}

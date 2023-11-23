import { useEffect, useState } from "preact/hooks";

export default function Test() {
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 700;
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  if (width > breakpoint) {
    return (
      <div className="w-full flex flex-row">
        <a href=""></a>
        <a href=""></a>
        <a href=""></a>
        {/* <h3>Component 1</h3>
        <p>Current width is {width} px</p> */}
      </div>
    );
  }
  return null;
}

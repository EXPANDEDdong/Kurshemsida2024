import type { ComponentChildren } from "preact";

export default function SideMenuTransitionWrapper(props: {
  children: ComponentChildren;
}) {
  return <>{props.children}</>;
}

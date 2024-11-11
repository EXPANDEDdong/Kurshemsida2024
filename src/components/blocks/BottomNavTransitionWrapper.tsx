import type { ComponentChildren } from "preact";

export default function BottomNavTransitionWrapper(props: {
  children: ComponentChildren;
}) {
  return <>{props.children}</>;
}

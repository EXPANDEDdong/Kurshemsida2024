import { MessagesSquare } from "lucide-preact";

export default function CommentsIcon({
  height,
  width,
}: {
  height: number;
  width: number;
}) {
  return <MessagesSquare height={height} width={width} />;
}

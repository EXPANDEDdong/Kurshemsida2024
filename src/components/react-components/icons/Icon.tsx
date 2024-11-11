import { Bird } from "lucide-preact";

export default function Icon({
  height,
  width,
}: {
  height: number;
  width: number;
}) {
  return <Bird height={height} width={width} />;
}

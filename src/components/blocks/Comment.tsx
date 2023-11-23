import { useEffect, useState } from "preact/hooks";

export default function Comment({
  username,
  content,
  date,
}: {
  username: string;
  content: string | null;
  date: Date;
}) {
  useEffect(() => {
    const newDate = new Date(date);
    const timeSince = timeDiff(new Date(), newDate);
    setCommentDate(timeSince || "No date somehow");
  });

  const [commentDate, setCommentDate] = useState("");

  function timeDiff(curr: any, prev: any) {
    const ms_Min = 60 * 1000;
    const ms_Hour = ms_Min * 60;
    const ms_Day = ms_Hour * 24;
    const ms_Mon = ms_Day * 30;
    const ms_Yr = ms_Day * 365;
    const diff = curr - prev;

    const conditions = [
      {
        test: (d: number) => d < ms_Min,
        result: (d: number) =>
          `${Math.round(d / 1000)} second${
            Math.round(d / 1000) === 1 ? "" : "s"
          } ago`,
      },
      {
        test: (d: number) => d < ms_Hour,
        result: (d: number) =>
          `${Math.round(d / ms_Min)} minute${
            Math.round(d / ms_Min) === 1 ? "" : "s"
          } ago`,
      },
      {
        test: (d: number) => d < ms_Day,
        result: (d: number) =>
          `${Math.round(d / ms_Hour)} hour${
            Math.round(d / ms_Hour) === 1 ? "" : "s"
          } ago`,
      },
      {
        test: (d: number) => d < ms_Mon,
        result: (d: number) =>
          `Around ${Math.round(d / ms_Day)} day${
            Math.round(d / ms_Day) === 1 ? "" : "s"
          } ago`,
      },
      {
        test: (d: number) => d < ms_Yr,
        result: (d: number) =>
          `Around ${Math.round(d / ms_Mon)} month${
            Math.round(d / ms_Mon) === 1 ? "" : "s"
          } ago`,
      },
      {
        test: (d: any) => true,
        result: (d: number) =>
          `Around ${Math.round(d / ms_Yr)} year${
            Math.round(d / ms_Yr) === 1 ? "" : "s"
          } ago`,
      },
    ];

    for (const condition of conditions) {
      if (condition.test(diff)) {
        return condition.result(diff);
      }
    }
  }

  return (
    <div className="py-4 px-6 bg-neutral-50 rounded-lg shadow-lg w-11/12 relative">
      <a href={`/user/${username}`} className={"w-fit"}>
        {username}
      </a>
      <div className={"w-full h-full relative"}>
        <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
        <p className="text-neutral-900 text-lg">{content}</p>
        <hr className="my-4 bg-neutral-200 text-neutral-200 border-neutral-200" />
        <p className={"text-neutral-900 text-sm"}>{commentDate}</p>
      </div>
    </div>
  );
}

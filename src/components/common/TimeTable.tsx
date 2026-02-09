import { PeriodsJA, PeriodTimes, PeriodType } from "@/src/data/periods";
import {
  TimeTablePeriodSequence,
  TimeTableSeparatePeriods,
} from "@/src/data/timetable";
import clsx from "clsx";

interface Props {
  date: Date;
  rooms: { name: string; color?: string }[];
  timetable: {
    [room in string]: string[];
  };
}

export function TimeTable({ date, rooms, timetable }: Props) {
  if (
    Object.keys(timetable).filter((room) =>
      rooms.map((r) => r.name).includes(room),
    ).length !== rooms.length
  ) {
    throw new Error("Timetable data does not match the rooms provided.");
  }
  return (
    <table className="bg-white text-black *:border-collapse">
      <thead>
        <tr className="h-12 border-b-2 border-black">
          <th
            className="font-normal text-3xl border-r-2 border-black"
            colSpan={2}
          >
            {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日
          </th>
          {rooms.map((room) => (
            <th
              className="font-normal text-xl border-black not-last:border-r-1"
              style={{
                backgroundColor: room.color ?? "transparent",
              }}
              key={room.name}
            >
              {room.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TimeTablePeriodSequence.map((period, i) => (
          <TimeTablePeriodRow
            period={period}
            rooms={rooms}
            rowidx={i}
            timetable={timetable}
            key={period}
          />
        ))}
      </tbody>
    </table>
  );
}

function TimeTablePeriodRow({
  period,
  rooms,
  rowidx,
  timetable,
}: {
  period: PeriodType;
  rooms: { name: string; color?: string }[];
  rowidx: number;
  timetable: {
    [room in string]: string[];
  };
}) {
  const needSeparate = TimeTableSeparatePeriods.includes(period);
  return (
    <tr
      className={clsx(
        "odd:bg-blue-100 *:max-w-32 *:w-32 *:border-1 *:border-stone-400/80",
        needSeparate ? "h-8" : "h-12",
      )}
      key={period}
    >
      <td
        className={clsx(
          "border-r-1! border-r-black!",
          needSeparate && "border-y-1! border-y-black!",
        )}
      >
        {PeriodsJA[period]}
      </td>
      <td
        className={clsx(
          "border-r-2! border-r-black!",
          needSeparate && "border-y-1! border-y-black!",
        )}
      >
        {PeriodTimes[period].start.hours}:
        {PeriodTimes[period].start.minutes.toString().padStart(2, "0")}〜
        {PeriodTimes[period].end.hours}:
        {PeriodTimes[period].end.minutes.toString().padStart(2, "0")}
      </td>
      {rooms.map((room) => {
        const lesson =
          timetable[room.name].length > rowidx
            ? timetable[room.name][rowidx]
            : undefined;
        return <td key={room.name}>{lesson || ""}</td>;
      })}
    </tr>
  );
}

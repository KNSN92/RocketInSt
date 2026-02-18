import { WeekDay } from "@/prisma/generated/prisma/enums";
import Schedules from "@/src/data/schedules";
import { LessonPeriodType, PeriodsJA, PeriodType } from "./periods";

import kobeSannomiya from "./campus/kobe-sannomiya";

export function LessonPeriod<W extends WeekDay, P extends LessonPeriodType>(
  weekday: W,
  period: P,
  title: (typeof Schedules)[W][P][number],
): { weekday: W; period: P; title: (typeof Schedules)[W][P][number] } {
  return { weekday: weekday, period: period, title: title };
}

export function Period(
  weekday: WeekDay,
  period: PeriodType,
): {
  weekday: WeekDay;
  period: PeriodType;
  title: (typeof PeriodsJA)[PeriodType];
} {
  return { weekday: weekday, period: period, title: PeriodsJA[period] };
}

type CampusesData = {
  [campus: string]: CampusData;
};

interface RoomPlan {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Lesson {
  weekday: WeekDay;
  period: PeriodType;
  title:
    | (typeof Schedules)[WeekDay][LessonPeriodType][number]
    | (typeof PeriodsJA)[PeriodType];
}

export interface CampusData {
  memberCount: number;
  mainRoom: number;
  rooms: RoomData[];
}

export interface RoomData {
  name: string;
  capacity: number;
  accentColor?: string;
  order: number;
  mustShow?: boolean;
  lessons: Lesson[];
  plan: RoomPlan;
}

const campuses: CampusesData = {
  神戸三ノ宮キャンパス: kobeSannomiya,
} as const;

export default campuses;

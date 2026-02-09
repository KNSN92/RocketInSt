import Schedules from "@/src/data/schedules";
import { LessonPeriodType, PeriodType } from "./periods";
import { WeekDay } from "@/prisma/generated/prisma/enums";

import kobeSannomiya from "./campus/kobe-sannomiya";

export function LessonPeriod<W extends WeekDay, P extends LessonPeriodType>(
  weekday: W,
  period: P,
  name: (typeof Schedules)[W][P][number],
): { weekday: W; period: P; name: (typeof Schedules)[W][P][number] } {
  return { weekday: weekday, period: period, name: name };
}

export function Period(
  weekday: WeekDay,
  period: PeriodType,
): { weekday: WeekDay; period: PeriodType } {
  return { weekday: weekday, period: period };
}

type CampusesData = {
  [campus: string]: CampusData;
};

export interface CampusData {
  memberCount: number;
  mainRoom: number;
  rooms: {
    name: string;
    capacity: number;
    accentColor?: string;
    lessons: {
      weekday: WeekDay;
      period: PeriodType;
      name?: (typeof Schedules)[WeekDay][LessonPeriodType][number];
    }[];
    plan: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
  }[];
}

const campuses: CampusesData = {
  神戸三ノ宮キャンパス: kobeSannomiya,
} as const;

export default campuses;

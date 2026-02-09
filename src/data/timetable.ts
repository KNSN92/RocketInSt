import { PeriodType } from "./periods";

export const TimeTablePeriodSequence: PeriodType[] = [
  "Morning",
  "MorningMeeting",
  "FirstPeriod",
  "SecondPeriod",
  "ThirdPeriod",
  "NoonRecess",
  "FourthPeriod",
  "FifthPeriod",
  "SixthPeriod",
  "ClosingMeeting",
  "AfterSchool",
] as const;

export const TimeTableSeparatePeriods: PeriodType[] = [
  "Morning",
  "MorningMeeting",
  "NoonRecess",
  "ClosingMeeting",
  "AfterSchool",
] as const;
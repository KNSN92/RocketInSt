import { AfterSchool } from "@prisma/client";

export type AfterSchoolKey = keyof typeof AfterSchoolMap;

export const AfterSchoolMap: {[afterschoolIndex in number]: AfterSchool} = {
    1: AfterSchool.LeaveImmediately,
    2: AfterSchool.StayForAWhile,
    3: AfterSchool.StayUntilEnd,
} as const;

export const ReversedAfterSchoolMap: {[afterschool in AfterSchool]: number} = {
    LeaveImmediately: 1,
    StayForAWhile: 2,
    StayUntilEnd: 3,
}

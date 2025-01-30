import { AfterSchool } from "@prisma/client";

export type AfterSchoolKey = keyof typeof AfterSchoolMap;

export const AfterSchoolMap: {[afterschoolIndex in number]: AfterSchool} = {
    1: AfterSchool.Leave,
    2: AfterSchool.Stay,
} as const;

export const ReversedAfterSchoolMap: {[afterschool in AfterSchool]: number} = {
    Leave: 1,
    Stay: 2,
} as const;

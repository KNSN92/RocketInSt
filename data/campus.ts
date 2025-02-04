import Schedules from "@/data/schedules";
import { LessonPeriodType, PeriodType } from "./periods";
import { WeekDay } from "@prisma/client";

function LessonPeriod<W extends WeekDay, P extends LessonPeriodType>(weekday: W, period: P, name: typeof Schedules[W][P][number]): { weekday: W, period: P, name: typeof Schedules[W][P][number] } {
    return { weekday: weekday, period: period, name: name };
}

function Period(weekday: WeekDay, period: PeriodType): { weekday: WeekDay, period: PeriodType } {
    return { weekday: weekday, period: period };
}

type CampusesData= {
    [campus: string]: {
        allMember: number,
        mainRoom: number,
        rooms: {
            name:string,
            capacity: number,
            lessons: { weekday: WeekDay, period: PeriodType, name?: typeof Schedules[WeekDay][LessonPeriodType][number] }[],
            plan: {
                x: number,
                y: number,
                w: number,
                h: number,
            },
        }[]
    }
};

const campuses: CampusesData = {
    "神戸三ノ宮キャンパス": {
        mainRoom: 0,
        allMember: 200,
        rooms: [
            {name: "大広間", capacity: 80, plan: {x: 1, y: 0, w: 3, h: 2}, lessons: [
                Period("Monday",    "MorningMeeting"),
                Period("Tuesday",   "MorningMeeting"),
                Period("Wednesday", "MorningMeeting"),
                Period("Thursday",  "MorningMeeting"),
                Period("Friday",    "MorningMeeting"),

                Period("Monday",    "NoonRecess"),
                Period("Tuesday",   "NoonRecess"),
                Period("Wednesday", "NoonRecess"),
                Period("Thursday",  "NoonRecess"),
                Period("Friday",    "NoonRecess"),

                Period("Monday",    "ClosingMeeting"),
                Period("Tuesday",   "ClosingMeeting"),
                Period("Wednesday", "ClosingMeeting"),
                Period("Thursday",  "ClosingMeeting"),
                Period("Friday",    "ClosingMeeting"),

                Period("Monday",    "AfterSchool"),
                Period("Tuesday",   "AfterSchool"),
                Period("Wednesday", "AfterSchool"),
                Period("Thursday",  "AfterSchool"),
                Period("Friday",    "AfterSchool"),

                LessonPeriod("Thursday", "FirstPeriod",  "プロジェクトN応用"),
                LessonPeriod("Thursday", "SecondPeriod", "プロジェクトN応用"),
                LessonPeriod("Thursday", "ThirdPeriod",  "キャンパス授業"),
                LessonPeriod("Thursday", "FourthPeriod", "アート・デザイン"),
                LessonPeriod("Thursday", "FifthPeriod",  "アート・デザイン"),
                LessonPeriod("Thursday", "SixthPeriod",  "コミュニティ活動"),
            ]},
            {name: "万里", capacity: 30, plan: {x: 2, y: 2, w: 2, h: 1}, lessons: [
                LessonPeriod("Thursday", "FirstPeriod",  "自習"),
                LessonPeriod("Thursday", "SecondPeriod", "自習"),
                LessonPeriod("Thursday", "FourthPeriod", "自主学習"),
                LessonPeriod("Thursday", "FifthPeriod",  "自主学習"),
                LessonPeriod("Thursday", "SixthPeriod",  "自主学習"),
            ]},
            {name: "秘密基地", capacity: 20, plan: {x: 0, y: 0, w: 1, h: 1}, lessons: [

            ]},
            {name: "7階", capacity: 50, plan: {x: 5, y: 0, w: 2, h: 3}, lessons: [

            ]},
        ]
    }
} as const

export default campuses

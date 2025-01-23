"use client";

import { ROW, ROW_JA, COL_JA } from "@/data/schedules";
import RadioButton from "../common/RadioButton";
import { handleRegisterAction } from "@/actions/register/RegisterFormAction";
import { ChangeEvent, useState } from "react";
import {
  CourseFreqDay,
  CourseFreqDays,
  CourseFreqToDayOfWeekMap,
} from "@/data/courseFreqs";
import { $Enums, DayOfWeek } from "@prisma/client";

export default function RegisterForm({
  campuses,
  initialTable,
  initialCampus,
  initialCourse,
  initialAfterschool,
}: {
  campuses: { title: string; value: string }[];
  initialTable: {
    [key: string]: {
      [key: string]: { id: string; title: string; selected?: boolean }[];
    };
  };
  initialCampus?: string;
  initialCourse?: number;
  initialAfterschool?: number;
}) {
  const [campus, setCampus] = useState(initialCampus);
  const [lessonTable, setLessonTable] = useState(initialTable);
  const [courseDays, setCourseDays] = useState<DayOfWeek[]>([
    ...CourseFreqToDayOfWeekMap[
      initialCourse ? (initialCourse as CourseFreqDay) : 1
    ],
  ]);

  function handleCourseChange(e: ChangeEvent<HTMLInputElement>) {
    const v = Number.parseInt(e.target.value);
    if (!CourseFreqDays.find((n) => v === n)) return;
    document
      .querySelectorAll<HTMLSelectElement>(".lesson-select")
      .forEach((ele) => {
        ele.selectedIndex = 0;
      });
    setCourseDays([...CourseFreqToDayOfWeekMap[v as CourseFreqDay]]);
  }

  function handleLessonChange(
    e: ChangeEvent<HTMLSelectElement>,
    c: $Enums.DayOfWeek,
    r: $Enums.LessonPeriod
  ) {
    const updatedLessons = lessonTable[c][r].map((lesson) => {
      lesson.selected = lesson.id === e.target.value;
      return lesson;
    });
    setLessonTable({
      ...lessonTable,
      c: {
        ...lessonTable[c],
        r: updatedLessons,
      },
    });
  }

  return (
    <form action={handleRegisterAction}>
      <div className="mt-8 w-96">
        <h2 className="text-2xl font-bold">キャンパスを選択</h2>
        <select
          name="campus"
          defaultValue={campus}
          onChange={(e) => {
            setCampus(e.target.value);
          }}
          required
          className="block w-96 h-12 px-2 text-xl rounded-lg bg-black text-white border-1 border-gray-400"
        >
          <option value="">キャンパスを選択</option>
          {campuses.map((campus, i) => (
            <option key={i} value={campus.value}>
              {campus.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-8 w-96">
        <h2 className="text-2xl font-bold">コースを選択</h2>
        <RadioButton
          className="ml-4"
          name="course"
          buttons={[
            { title: "週1日", value: 1, checked: courseDays.length === 1 },
            { title: "週3日", value: 3, checked: courseDays.length === 3 },
            { title: "週5日", value: 5, checked: courseDays.length === 5 },
          ]}
          onChange={handleCourseChange}
          required
        />
      </div>
      <h2 className="mt-8 block w-96 text-2xl font-bold">授業を選択</h2>
      <div className="w-fit">
        <table>
          <thead>
            <tr>
              <th></th>
              {courseDays.map((col, i) => (
                <th key={i}>{COL_JA[col]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW.map((r, i) => (
              <tr key={i}>
                <th>{ROW_JA[r]}</th>
                {courseDays.map((c, j) => (
                  <td key={j}>
                    <select
                      required
                      value={
                        lessonTable[c][r].find((lesson) => lesson.selected)?.id ||
                        undefined
                      }
                      onChange={(e) => handleLessonChange(e, c, r)}
                      name="lessons"
                      className="lesson-select w-48 bg-black text-white"
                    >
                      <option value="">選択</option>
                      {lessonTable[c][r].map(({ id, title }, i) => (
                        <option key={i} value={id}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-96 mt-8">
        <h2 className="text-2xl font-bold">放課後の動きを選択</h2>
        <RadioButton
          name="afterschool"
          className="ml-4"
          buttons={[
            { title: "すぐ帰る", value: 1, checked: initialAfterschool === 1 },
            {
              title: "途中まで居る",
              value: 2,
              checked: initialAfterschool === 2,
            },
            {
              title: "最後まで居る",
              value: 3,
              checked: initialAfterschool === 3,
            },
          ]}
          required
        />
      </div>
      <div className="w-fit mx-auto mt-8">
        <button type="submit" className="block w-24 h-12 bg-blue-600 rounded-sm text-2xl font-bold">送信</button>
      </div>
    </form>
  );
}

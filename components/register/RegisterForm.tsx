"use client";

import { ROW, ROW_JA, COL_JA } from "@/data/schedules";
import RadioButton from "../common/RadioButton";
import { handleRegisterAction } from "@/actions/register/RegisterFormAction";
import { ChangeEvent, useActionState, useState } from "react";
import {
  CourseFreqDay,
  CourseFreqDays,
  CourseFreqToDayOfWeekMap,
} from "@/data/courseFreqs";
import { $Enums, DayOfWeek } from "@prisma/client";
import clsx from "clsx";

export default function RegisterForm({
  campuses,
  initialTable,
  initialNickName,
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
  initialNickName?: string;
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

  const [state, formAction, isPending] = useActionState(handleRegisterAction, { error: false });

  return (
    <>
      {state.error && <div className="mx-auto w-[60vw] min-h-24 h-fit mt-8 p-4 bg-red-600 border-4 border-red-800 rounded-xl flex justify-center items-center text-2xl">
        {state.msg}
      </div>}
      <div className="w-fit mx-auto mt-12 p-16 rounded-2xl border-[1px] border-gray-800">
        <h1 className="block w-fit mx-auto mb-4 text-3xl font-bold">情報を設定</h1>
        <form action={formAction}>
          <div className="mt-8 w-96">
            <h2 className="text-xl font-bold mb-2">ニックネームを入力</h2>
            <input className="block w-96 h-12 px-2 text-xl rounded-lg bg-white text-black border-1 border-gray-400" name="nickname" defaultValue={initialNickName}  />
          </div>
          <div className="mt-8 w-96">
            <h2 className="text-xl font-bold mb-2">キャンパスを選択</h2>
            <select
              name="campus"
              defaultValue={campus}
              onChange={(e) => {
                setCampus(e.target.value);
              }}
              required
              className="block w-96 h-12 px-2 text-xl rounded-lg bg-white text-black border-1 border-gray-400 mb-2"
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
            <h2 className="text-xl font-bold mb-2">コースを選択</h2>
            <RadioButton
              className="ml-4 text-base font-sans font-medium"
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
          <h2 className="mt-8 block w-96 text-xl font-bold mb-3">授業を選択</h2>
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
                    <th className="text-sm">{ROW_JA[r]}</th>
                    {courseDays.map((c, j) => (
                      <td key={j}>
                        <select
                          required
                          defaultValue={
                            lessonTable[c][r].find((lesson) => lesson.selected)?.id ||
                            undefined
                          }
                          onChange={(e) => handleLessonChange(e, c, r)}
                          name="lessons"
                          className="lesson-select w-48 bg-white text-black"
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
            <h2 className="text-xl font-bold mb-2">放課後の動きを選択</h2>
            <RadioButton
              name="afterschool"
              className="ml-4"
              buttons={[
                { title: "帰る", value: 1, checked: initialAfterschool === 1 },
                { title: "残る", value: 2, checked: initialAfterschool === 2 },
              ]}
              required
            />
          </div>
          <div className="w-fit mx-auto mt-8">
            <button type="submit" className={clsx("block w-fit px-8 h-12 rounded-sm text-2xl font-bold", isPending ? "bg-blue-800" : "bg-blue-600")}>{isPending ? "送信中..." : "送信"}</button>
          </div>
        </form>
      </div>
    </>
  );
}

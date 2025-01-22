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
        console.log(ele);
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
      <h1>キャンパスを選択</h1>
      <select
        name="campus"
        defaultValue={campus}
        onChange={(e) => {
          setCampus(e.target.value);
        }}
        required
        className="w-fit bg-black text-white"
      >
        <option value="">キャンパスを選択</option>
        {campuses.map((campus, i) => (
          <option key={i} value={campus.value}>
            {campus.title}
          </option>
        ))}
      </select>
      <h1>コースを選択</h1>
      <RadioButton
        name="course"
        buttons={[
          { title: "週1日", value: 1, checked: courseDays.length === 1 },
          { title: "週3日", value: 3, checked: courseDays.length === 3 },
          { title: "週5日", value: 5, checked: courseDays.length === 5 },
        ]}
        onChange={handleCourseChange}
        required
      />
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
                    className="lesson-select w-64 bg-black text-white"
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
      <h1>放課後の動きを選択</h1>
      <RadioButton
        name="afterschool"
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
      <button type="submit">送信</button>
    </form>
  );
}

"use client";

import RadioButton from "../../components/common/RadioButton";
import handleRegisterAction from "@/actions/register/RegisterFormAction";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import {
  CourseFreqDay,
  CourseFreqDays,
  DaysToWeekDayMap,
} from "@/data/courseFreqs";
import { WeekDay } from "@prisma/client";
import {
  LessonPeriods,
  LessonPeriodsJA,
  LessonPeriodType,
} from "@/data/periods";
import { WeekDayJA } from "@/data/weekdays";
import { PrimaryButton } from "../../components/common/Buttons";

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
      [key: string]: { id: string; title: string; selected: boolean }[];
    };
  };
  initialNickName?: string;
  initialCampus?: string;
  initialCourse?: CourseFreqDay;
  initialAfterschool?: number;
}) {
  const [registerData, setRegisterData] = useState({
    nickname: initialNickName || "",
    campus: initialCampus,
    course: initialCourse || 1,
  });
  const [lessonTable, setLessonTable] = useState(initialTable);

  function handleCourseChange(e: ChangeEvent<HTMLInputElement>) {
    const v = Number.parseInt(e.target.value);
    if (!CourseFreqDays.find((n) => v === n)) return;
    document
      .querySelectorAll<HTMLSelectElement>(".lesson-select")
      .forEach((ele) => {
        ele.selectedIndex = 0;
      });
    setRegisterData({ ...registerData, course: v as CourseFreqDay });
  }

  function handleLessonChange(
    e: ChangeEvent<HTMLSelectElement>,
    c: WeekDay,
    r: LessonPeriodType
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

  const [state, formAction, isPending] = useActionState(handleRegisterAction, {
    error: false,
  });

  useEffect(() => setRegisterData({ ...registerData }), [isPending]);

  return (
    <>
      {state.error && (
        <div className="mx-auto w-[60vw] min-h-24 h-fit mt-8 p-4 text-white bg-red-400 border-4 border-red-300 rounded-xl flex justify-center items-center text-2xl">
          {state.msg}
        </div>
      )}
      <div className="w-fit mx-auto mt-12 p-16 bg-blue-100 rounded-2xl border-1 border-gray-800">
        <h1 className="block w-fit mx-auto mb-4 text-3xl font-bold">
          情報を設定
        </h1>
        <p className="mx-auto mb-4 text-xl">
          当サイトの機能を使うには以下の情報を入力する必要があります。
        </p>
        <form action={formAction}>
          <div className="mt-8 w-96 mx-auto">
            <h2 className="text-xl font-bold mb-2">ニックネームを入力</h2>
            <input
              className="block w-96 h-12 px-2 text-xl rounded-lg bg-[#ebf6f7] text-black border-1 border-gray-400"
              name="nickname"
              value={registerData.nickname}
              onChange={(e) =>
                setRegisterData({ ...registerData, nickname: e.target.value })
              }
              disabled={isPending}
            />
          </div>
          <div className="mt-8 w-96 mx-auto">
            <h2 className="text-xl font-bold mb-2">キャンパスを選択</h2>
            <select
              name="campus"
              value={registerData.campus}
              onChange={(e) => {
                setRegisterData({ ...registerData, campus: e.target.value });
              }}
              required
              disabled={isPending}
              className="block w-96 h-12 px-2 text-xl rounded-lg bg-[#ebf6f7] text-black border-1 border-gray-400 mb-2"
            >
              <option value="">キャンパスを選択</option>
              {campuses.map((campus, i) => (
                <option key={i} value={campus.value}>
                  {campus.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-8 w-96 mx-auto">
            <h2 className="text-xl font-bold mb-2">コースを選択</h2>
            <RadioButton
              className="p-4 w-96 text-base font-sans font-medium bg-[#ebf6f7] border-1 border-gray-400 rounded-lg"
              name="course"
              buttons={[
                {
                  title: "週1日",
                  value: 1,
                  checked: registerData.course === 1,
                },
                {
                  title: "週3日",
                  value: 3,
                  checked: registerData.course === 3,
                },
                {
                  title: "週5日",
                  value: 5,
                  checked: registerData.course === 5,
                },
              ]}
              onChange={handleCourseChange}
              required
              disabled={isPending}
            />
          </div>
          <h2 className="mt-8 block mx-auto w-fit text-xl font-bold mb-3">
            授業を選択
          </h2>
          <div className="min-w-96 flex justify-center">
            <table className="mx-auto w-fit bg-[#ebf6f7] border-1 border-gray-400 rounded-lg">
              <thead>
                <tr>
                  <th></th>
                  {DaysToWeekDayMap[registerData.course].map((weekday, i) => (
                    <th
                      key={i}
                      className="w-60 text-lg border-l-1 border-gray-400"
                    >
                      {WeekDayJA[weekday]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LessonPeriods.map((lessonPeriod, i) => (
                  <tr className="border-t-1 border-gray-400" key={i}>
                    <th className="text-lg">
                      <div className="px-2">
                        {LessonPeriodsJA[lessonPeriod]}
                      </div>
                    </th>
                    {DaysToWeekDayMap[registerData.course].map(
                      (courseDay, j) => (
                        <td className="border-l-1 border-gray-400" key={j}>
                          <select
                            value={
                              lessonTable[courseDay][lessonPeriod].find(
                                (lesson) => lesson.selected
                              )?.id || ""
                            }
                            onChange={(e) =>
                              handleLessonChange(e, courseDay, lessonPeriod)
                            }
                            name="lessons"
                            required
                            disabled={isPending}
                            className="lesson-select w-60 py-2 bg-[#ebf6f7]"
                          >
                            <option value="">選択</option>
                            {lessonTable[courseDay][lessonPeriod].map(
                              ({ id, title }, i) => (
                                <option key={i} value={id}>
                                  {title}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-96 mx-auto mt-8">
            <h2 className="text-xl font-bold mb-2">放課後の動きを選択</h2>
            <RadioButton
              name="afterschool"
              className="p-4 w-96 text-base font-sans font-medium bg-[#ebf6f7] border-1 border-gray-400 rounded-lg"
              buttons={[
                { title: "帰る", value: 0, checked: initialAfterschool === 0 },
                { title: "残る", value: 1, checked: initialAfterschool === 1 },
              ]}
              required
              disabled={isPending}
            />
          </div>
          <div className="w-fit mx-auto mt-8">
            <PrimaryButton type="submit" disabled={isPending}>
              {isPending ? "送信中..." : "送信"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </>
  );
}

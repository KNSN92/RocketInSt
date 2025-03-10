"use client";

import handleRegisterAction from "@/actions/register/RegisterFormAction";
import {
  CourseFreqDay,
  CourseFreqDays,
  DaysToWeekDayMap,
} from "@/data/courseFreqs";
import {
  LessonPeriods,
  LessonPeriodsJA,
  LessonPeriodType,
} from "@/data/periods";
import { WeekDayJA } from "@/data/weekdays";
import { useNotification } from "@/lib/notification";
import { WeekDay } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { Button } from "../../components/common/Buttons";
import RadioButton from "../../components/common/RadioButton";

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
      [key: string]: { id: string; title: string; selected: boolean }[];
    };
  };
  initialCampus?: string;
  initialCourse?: CourseFreqDay;
  initialAfterschool?: number;
}) {
  const [registerData, setRegisterData] = useState({
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
    r: LessonPeriodType,
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
    success: false,
    error: false,
  });

  useEffect(() => {
    setRegisterData({ ...registerData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  const { push } = useRouter();
  const { notify } = useNotification();

  useEffect(() => {
    if (state.error) notify(state.msg || "", "error", 15000);
    if (state.success) {
      notify("情報を設定しました。", "success");
      push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <div className="w-screen sm:w-fit sm:mx-auto sm:px-16 my-12 flex flex-col items-center justify-center rounded-2xl border-1 border-blue-400 bg-blue-100 dark:bg-transparent dark:border-2 py-16">
        <h1 className="mx-auto mb-4 block w-fit text-3xl font-bold">
          情報を設定
        </h1>
        <p className="mx-auto mb-4 text-xl w-80 sm:w-96">
          当サイトの機能を使うには以下の情報を入力する必要があります。
        </p>
        <form action={formAction} className="w-fit mx-auto">
          <div className="mx-auto mt-8 w-80 sm:w-96">
            <h2 className="mb-2 text-xl font-bold">キャンパスを選択</h2>
            <select
              name="campus"
              value={registerData.campus}
              onChange={(e) => {
                setRegisterData({ ...registerData, campus: e.target.value });
              }}
              required
              disabled={isPending}
              className="mb-2 block h-12 w-full rounded-lg border-1 border-gray-400 bg-[#ebf6f7] dark:bg-transparent dark:border-[#b8e2e6] dark:text-[#b8e2e6] px-2 text-xl"
            >
              <option value="">キャンパスを選択</option>
              {campuses.map((campus, i) => (
                <option key={i} value={campus.value}>
                  {campus.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mx-auto mt-8 w-80 sm:w-96">
            <h2 className="mb-2 text-xl font-bold">コースを選択</h2>
            <RadioButton
              className="w-full rounded-lg border-1 border-gray-400 bg-[#ebf6f7] dark:bg-transparent dark:border-[#b8e2e6] dark:text-[#b8e2e6] p-4 font-sans text-base font-medium"
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
          <h2 className="mx-auto mb-3 mt-8 block w-fit text-xl font-bold">
            授業を選択
          </h2>
          <div className="overflow-auto mx-auto w-80 sm:w-96">
            <table className="w-fit h-fit mx-auto rounded-lg border-1 border-gray-400 bg-[#ebf6f7] dark:border-[#b8e2e6] dark:bg-transparent">
              <thead>
                <tr>
                  <th></th>
                  {DaysToWeekDayMap[registerData.course].map((weekday, i) => (
                    <th
                      key={i}
                      className="w-40 sm:w-60 border-l-1 border-gray-400 dark:border-[#b8e2e6] dark:text-[#b8e2e6] text-lg"
                    >
                      {WeekDayJA[weekday]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LessonPeriods.map((lessonPeriod, i) => (
                  <tr
                    className="border-t-1 border-gray-400 dark:border-[#b8e2e6]"
                    key={i}
                  >
                    <th className="text-lg">
                      <div className="px-2 text-nowrap dark:text-[#b8e2e6]">
                        {LessonPeriodsJA[lessonPeriod]}
                      </div>
                    </th>
                    {DaysToWeekDayMap[registerData.course].map(
                      (courseDay, j) => (
                        <td
                          className="border-l-1 border-gray-400 dark:border-[#b8e2e6] w-fit h-fit"
                          key={j}
                        >
                          <select
                            value={
                              lessonTable[courseDay][lessonPeriod].find(
                                (lesson) => lesson.selected,
                              )?.id || ""
                            }
                            onChange={(e) =>
                              handleLessonChange(e, courseDay, lessonPeriod)
                            }
                            name="lessons"
                            required
                            disabled={isPending}
                            className="lesson-select w-40 sm:w-60 bg-[#ebf6f7] dark:bg-transparent dark:text-[#b8e2e6] py-2"
                          >
                            <option value="">選択</option>
                            {lessonTable[courseDay][lessonPeriod].map(
                              ({ id, title }, i) => (
                                <option key={i} value={id}>
                                  {title}
                                </option>
                              ),
                            )}
                          </select>
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mx-auto mt-8 w-80 sm:w-96">
            <h2 className="mb-2 text-xl font-bold">放課後の動きを選択</h2>
            <RadioButton
              name="afterschool"
              className="w-full rounded-lg border-1 border-gray-400 bg-[#ebf6f7]  dark:bg-transparent dark:border-[#b8e2e6] dark:text-[#b8e2e6] p-4 font-sans text-base font-medium"
              buttons={[
                { title: "帰る", value: 0, checked: initialAfterschool === 0 },
                { title: "残る", value: 1, checked: initialAfterschool === 1 },
              ]}
              required
              disabled={isPending}
            />
          </div>
          <div className="mx-auto mt-8 w-fit">
            <Button color="primary" type="submit" disabled={isPending}>
              {isPending ? "送信中..." : "送信"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

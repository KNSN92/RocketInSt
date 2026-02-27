"use server";

import { getTimeTableToken } from "@/src/db/timetable-uploader";

type GetTimeTableTokenResult =
  | {
      error: "NoUser" | "NoPerm" | "NoCampus" | "NoToken" | "Expired";
    }
  | {
      expiresAt: Date;
      campusId: string;
    };

export async function getTimeTableTokenStatus(): Promise<GetTimeTableTokenResult> {
  const result = await getTimeTableToken();
  if (typeof result === "string") {
    return {
      error: result,
    };
  }
  return {
    expiresAt: result.expiresAt,
    campusId: result.campusId,
  };
}

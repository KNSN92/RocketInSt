"use server";

import { prisma } from "@/prisma";
import { canModifyTimetable } from "@/src/data/role";
import { getTimeTableToken } from "@/src/db/timetable-uploader";
import { randomToken256 } from "@/src/lib/hash";
import { fetchUser, fetchUserId } from "@/src/lib/userdata";

const TOKEN_EXPIRATION_DAYS = 365;

function getExpirationDate() {
  return new Date(Date.now() + TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
}

export async function refreshTimeTableToken() {
  const timeTableToken = await getTimeTableToken();

  // NoTokenとExpiredの場合は新規作成または再作成が可能
  if (typeof timeTableToken === "string") {
    // NoTokenとExpired以外のエラーはそのまま返す
    if (timeTableToken !== "NoToken" && timeTableToken !== "Expired") {
      return {
        error: timeTableToken,
      };
    }

    // トークンを新規作成する場合、campusIdを取得
    const userId = await fetchUserId();
    if (!userId) return { error: "NoUser" };

    const userInfo = await fetchUser(userId, {
      role: true,
      campusId: true,
      moderatorOrMentorCampusId: true,
    });

    if (!userInfo) return { error: "NoUser" };
    const {
      role,
      moderatorOrMentorCampusId,
      campusId: userCampusId,
    } = userInfo;

    if (!canModifyTimetable(role)) return { error: "NoPerm" };

    const campusId =
      role === "Admin" ? userCampusId : moderatorOrMentorCampusId;
    if (!campusId) return { error: "NoCampus" };

    const { token, hash } = await randomToken256();

    // NoTokenの場合は新規作成、Expiredの場合は更新
    if (timeTableToken === "NoToken") {
      await prisma.timeTableUploader.create({
        data: {
          token: hash,
          expiresAt: getExpirationDate(),
          campusId,
        },
      });
    } else {
      // Expiredの場合、既存のレコードを更新
      await prisma.timeTableUploader.updateMany({
        where: { campusId },
        data: {
          token: hash,
          expiresAt: getExpirationDate(),
        },
      });
    }

    return {
      success: token,
    };
  }

  // 既存のトークンを更新
  const { token, hash } = await randomToken256();
  await prisma.timeTableUploader.update({
    where: {
      id: timeTableToken.id,
    },
    data: {
      token: hash,
      expiresAt: getExpirationDate(),
    },
  });
  return {
    success: token,
  };
}

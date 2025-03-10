"use server";
import { fetchUserId, isUserFriend, userExist } from "@/lib/userdata";
import { prisma } from "@/prisma";
import { z } from "zod";

const profileUserSchema = z
  .string({ invalid_type_error: "ユーザーはstring型として入力してください。" })
  .refine(
    async (userId) => await userExist(userId),
    "ユーザーが見つかりませんでした。",
  );

export default async function registerFriendAction(
  previousState: { isFriend: boolean; success: boolean; error: boolean; msg: string },
  formData: FormData,
) {
  const myUserId = await fetchUserId();
  if (!myUserId)
    return {
      isFriend: previousState.isFriend,
      success: false,
      error: true,
      msg: "ログインしてください。",
    };
  const parseResult = await profileUserSchema.safeParseAsync(
    formData.get("user"),
  );
  if (!parseResult.success)
    return {
      isFriend: previousState.isFriend,
      success: false,
      error: true,
      msg: parseResult.error.errors[0].message,
    };
  const profileUserId = parseResult.data;
  if(myUserId === profileUserId) return {
    isFriend: previousState.isFriend,
    success: false,
    error: true,
    msg: "自分自身をフレンド登録しようとしています。",
  }
  const isFriend = await isUserFriend(myUserId, profileUserId);
  if (!isFriend) {
    await prisma.user.update({
      where: {
        id: myUserId,
      },
      data: {
        following: {
          connect: {
            id: profileUserId,
          },
        },
      },
    });
    return { isFriend: true, success: true, error: false, msg: "" };
  } else {
    await prisma.user.update({
      where: {
        id: myUserId,
      },
      data: {
        following: {
          disconnect: {
            id: profileUserId,
          },
        },
      },
    });
    return { isFriend: false, success: true, error: false, msg: "" };
  }
}

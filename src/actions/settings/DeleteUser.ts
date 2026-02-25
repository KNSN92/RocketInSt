/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prisma } from "@/prisma";
import { fetchUserId } from "@/src/lib/userdata";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export async function deleteUser(
  prevState: { success: boolean; error: boolean; msg?: string },
  formData: FormData,
): Promise<{ success: boolean; error: boolean; msg?: string }> {
  const userId = await fetchUserId();
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return {
        success: false,
        error: true,
        msg: `ユーザーの削除中にエラーが発生しました。${e.message}`,
      };
    } else {
      throw e;
    }
  }
  return { success: true, error: false };
}

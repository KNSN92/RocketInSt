"use server";

import { fetchUser, fetchUserId } from "@/src/lib/userdata";
import { prisma } from "@/prisma";
import { Prisma } from "@prisma-gen/browser";
import { signOut } from "next-auth/react";
import { z } from "zod";

const nicknameSchema = z
  .string({
    invalid_type_error: "ニックネームは文字列として入力してください。",
  })
  .max(20, {message: "ニックネームは20文字以下の長さにしてください。"});

export async function setNickname(prevState: { nickname: string | undefined, success: boolean, error: boolean; msg?: string }, formData: FormData): Promise<{ nickname: string | undefined, success: boolean, error: boolean; msg?: string }> {
	const parseResult = nicknameSchema.safeParse(formData.get("nickname"));
	if (!parseResult.success)
		return { nickname: prevState.nickname, success: false, error: true, msg: parseResult.error?.errors[0].message };
	const userId = await fetchUserId();
	const nickname = parseResult.data;
	await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			nickname: nickname.length <= 0 ? null : nickname
		}
	});
	return {
		nickname: nickname,
		success: true,
		error: false,
	}
}

export async function deleteUser(prevState: { success: boolean, error: boolean; msg?: string }, formData: FormData): Promise<{ success: boolean, error: boolean; msg?: string }> {
	const userId = await fetchUserId();
	try {
		await prisma.user.delete({
			where: {
				id: userId
			}
		});
	} catch(e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				error: true,
				msg: `ユーザーの削除中にエラーが発生しました。${e.message}`
			}
		} else {
			throw e;
		}
	}
	return { success: true, error: false }
}

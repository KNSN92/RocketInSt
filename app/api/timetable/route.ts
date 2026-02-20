import { prisma } from "@/prisma";
import { TimeTablePeriodSequence } from "@/src/data/timetable";
import { hashToken } from "@/src/lib/hash";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const LessonSchema = z
  .string()
  .max(100, "Lesson title must be at most 100 characters long.");

const RoomTimeTableSchema = z.record(
  z.enum(TimeTablePeriodSequence as [string, ...string[]]),
  LessonSchema,
);

const TimeTableSchema = z.record(z.string(), RoomTimeTableSchema);

/**
 * キャンパスに属する部屋名のみを許容する TimeTableSchema
 * @param campusId バリデーション対象のキャンパスID
 * @returns 部屋名検証付きの Zod スキーマ
 */
const createTimeTableSchemaWithCampusValidation = (campusId: string) =>
  TimeTableSchema.refine(
    async (data) => {
      // campusId に属する全ての部屋を取得
      const rooms = await prisma.room.findMany({
        where: { campusId },
        select: { name: true },
      });
      const validRoomNames = new Set(rooms.map((r) => r.name));

      // タイムテーブルのキー（部屋名）がすべて有効か確認
      return Object.keys(data).every((roomName) =>
        validRoomNames.has(roomName),
      );
    },
    {
      message: "Invalid room names. Check room names for the specified campus.",
    },
  );

// 7は"Bearer "の部分
const bearerTokenSchema = z
  .string()
  .regex(
    /^Bearer [0-9a-f]{64,}$/,
    "Authorization Header must start with 'Bearer ' and contain the hex token after it.",
  )
  .min(64 + 7) // 最低でも256ビットのトークン長を保証
  .max(512 + 7) // 変に長いトークンを弾くための上限
  .transform((str) => str.slice(7));

export async function POST(req: NextRequest) {
  const rawToken = await req.headers.get("Authorization");
  if (!rawToken) return new NextResponse("Unauthorized", { status: 401 });
  const tokenParseResult = bearerTokenSchema.safeParse(rawToken);
  const token = tokenParseResult.data;
  if (!token) {
    console.log(tokenParseResult.error);
    return invalidTokenRes();
  }
  const fetchedToken = await fetchApiToken(token);
  if (fetchedToken == null) return invalidTokenRes();
  if (fetchedToken.expiresAt < new Date()) return invalidTokenRes();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const campusId = fetchedToken.campusId;

  const timeTableValidationSchema =
    createTimeTableSchemaWithCampusValidation(campusId);
  const parseResult = await timeTableValidationSchema.safeParseAsync(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid timetable data", details: parseResult.error.errors },
      { status: 400 },
    );
  }

  try {
    await storeTimetable(campusId, parseResult.data);
  } catch (e) {
    console.error(e);
    return new NextResponse("Failed to store timetable", { status: 500 });
  }

  const res = NextResponse.json({
    message: "success",
    campus: fetchedToken.campus.name,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

function invalidTokenRes() {
  return new NextResponse("Invalid Token", { status: 401 });
}

async function fetchApiToken(token: string) {
  const hashedToken = await hashToken(token);
  const result = await prisma.timeTableUploader.findUnique({
    where: {
      token: hashedToken,
    },
    select: {
      campusId: true,
      campus: {
        select: {
          name: true,
        },
      },
      expiresAt: true,
    },
  });
  return result;
}

async function storeTimetable(
  campusId: string,
  timetable: z.infer<typeof TimeTableSchema>,
) {
  await prisma.timeTable.create({
    data: {
      date: new Date(),
      campus: {
        connect: { id: campusId },
      },
      rawTable: timetable,
    },
  });
}

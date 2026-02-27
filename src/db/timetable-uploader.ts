import { prisma } from "@/prisma";
import { canModifyTimetable } from "../data/role";
import { fetchUser, fetchUserId } from "../lib/userdata";

export async function getTimeTableToken() {
  const userId = await fetchUserId();
  if (!userId) return "NoUser";
  const userInfo = await fetchUser(userId, {
    role: true,
    campusId: true,
    moderatorOrMentorCampusId: true,
  });
  console.log(userInfo);
  if (!userInfo) return "NoUser";
  const { role, moderatorOrMentorCampusId, campusId: userCampusId } = userInfo;
  if (!canModifyTimetable(role)) return "NoPerm";
  const campusId = role === "Admin" ? userCampusId : moderatorOrMentorCampusId;
  if (!campusId) return "NoCampus";
  const r = await prisma.timeTableUploader.findFirst({
    where: { campusId },
  });
  if (r == null) {
    return "NoToken";
  }
  if (r.expiresAt < new Date()) {
    return "Expired";
  }
  return r;
}

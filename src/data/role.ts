import { Role } from "@prisma-gen/browser";

export const RoleJA: { [K in Role]: string } = {
  Admin: "管理者",
  Mentor: "メンター",
  Moderator: "モデレーター",
  User: "一般ユーザー",
};

export const RoleColors: { [K in Role]: string } = {
  Admin: "text-[#f00]",
  Mentor: "text-yellow-200",
  Moderator: "text-green-400",
  User: "",
};

export function shouldShowRole(role: Role): boolean {
  return role !== "User";
}

export function canModifyTimetable(role: Role): boolean {
  return role === "Admin" || role === "Moderator" || role === "Mentor";
}

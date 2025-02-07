import { prisma } from "@/prisma";
import { notFound } from "next/navigation";

export default async function UserInfo({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    return (
        <p>{user?.name}</p>
    );
}
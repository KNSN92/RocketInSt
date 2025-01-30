import authConfig from "@/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function LoginRequired({ children, message }: { children: ReactNode, message?: ReactNode }) {
    const session = await getServerSession(authConfig);
    if(!session) {
        if(message) {
            return message;
        }else {
            redirect("/signin");
        }
    }
    return children;
}
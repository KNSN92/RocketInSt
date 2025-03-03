import { Metadata } from "next";
import { AuthSuccessNotificator } from "./AuthSuccessNotificator";

export const metadata: Metadata = {
  title: "AuthSuccess",
};

export default async function AuthError() {
  return <AuthSuccessNotificator />;
}

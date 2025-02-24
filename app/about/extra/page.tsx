import { Metadata } from "next";
import ExtraAbout from "./ExtraAbout";

export const metadata: Metadata = {
  title: "ExtaAbout",
};

export default function Page() {
  return <ExtraAbout />;
}

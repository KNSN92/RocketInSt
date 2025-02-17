"use client";

export default function UpdatedTime({ className }: { className?: string }) {
  const now = new Date().toLocaleString();
  return <span className={className}>{now}</span>;
}

export default function UpdatedTime({ className }: { className?: string }) {
  "use client";
  const now = new Date().toLocaleString();
  return <span className={className}>{now}</span>;
}

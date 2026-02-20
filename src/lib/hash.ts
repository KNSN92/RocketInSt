export async function hashToken(token: string) {
  const hashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return Buffer.from(hashBuf).toString("hex");
}

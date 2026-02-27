export async function hashToken(token: string) {
  const hashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return Buffer.from(hashBuf).toString("hex");
}

export async function randomToken256() {
  const array = new Uint8Array(32); // 256 bits = 32 bytes
  crypto.getRandomValues(array);
  const token = Buffer.from(array).toString("hex");
  const hash = await hashToken(token);
  return {
    token,
    hash,
  };
}

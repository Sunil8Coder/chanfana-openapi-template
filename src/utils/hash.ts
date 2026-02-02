// src/utils/hash.ts

const encoder = new TextEncoder();

/**
 * Hash password using SHA-256 (Worker safe)
 */
export async function hashPassword(password: string): Promise<string> {
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hashBuffer);
}

/**
 * Compare raw password with stored hash
 */
export async function comparePassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === storedHash;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

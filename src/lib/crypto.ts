// lib/crypto.ts
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_SECRET || "default_secret")
  .digest(); // must be 32 bytes

// Encrypt token
export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16); // initialization vector
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  // return iv + authTag + encrypted as one string
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

// Decrypt token
export function decryptToken(encrypted: string): string {
  const [ivHex, authTagHex, encryptedData] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

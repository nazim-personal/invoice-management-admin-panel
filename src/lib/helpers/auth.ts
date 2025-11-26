// lib/helpers/auth.ts
import { getAcessToken } from "./cookieHandler";

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAcessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

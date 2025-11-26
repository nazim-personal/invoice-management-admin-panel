'use server'
import { cookies } from 'next/headers'
import { decryptToken } from '../crypto';

export async function getAcessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const encrypted_access_token = cookieStore.get('access_token')?.value;
    if (!encrypted_access_token) return null;
    try {
        return decryptToken(encrypted_access_token);
    } catch (e) {
        console.error('Failed to parse access_token cookie', e);
        return null;
    }
}
export async function deleteAccessToken() {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
}
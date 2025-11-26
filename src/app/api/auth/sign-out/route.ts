// app/api/auth/sign-out/route.ts
import { API_AUTH_SIGN_OUT } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { deleteAccessToken } from "@/lib/helpers/cookieHandler";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await withAuthProxy<{ success: boolean }>({
      url: API_AUTH_SIGN_OUT,
      method: "POST",
    });

    if (response?.success) {
      deleteAccessToken();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Sign-out failed" }, { status: 400 });
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

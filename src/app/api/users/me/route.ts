import { API_USERS_ME } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { UserApiResponseTypes } from "@/lib/types/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await withAuthProxy<UserApiResponseTypes>({
      url: API_USERS_ME,
      method: "GET",
    });
    const user_info = response?.data.results || null;    
    if (!user_info) {
      return NextResponse.json(
        { authenticated: false, error: "User not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: response.success,
      user_info,
    });
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

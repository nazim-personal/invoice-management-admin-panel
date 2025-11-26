import { API_USERS_PROFILE } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { UserApiResponseTypes } from "@/lib/types/users";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const response = await withAuthProxy<UserApiResponseTypes>({
      url: API_USERS_PROFILE,
      method: "PUT",
      data: body,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}
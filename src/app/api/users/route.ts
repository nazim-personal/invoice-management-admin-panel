import { API_USERS } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const q = searchParams.get("q");

    const response = await withAuthProxy({
      url: API_USERS,
      method: "GET",
      params: {
        page: page || 1,
        limit: limit || 10,
        q: q || undefined,
      },
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await withAuthProxy({
      url: API_USERS,
      method: "POST",
      data: body,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

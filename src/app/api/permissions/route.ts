import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await withAuthProxy({
      url: "/permissions",
      method: "GET",
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

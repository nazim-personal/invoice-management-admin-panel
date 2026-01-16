import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await withAuthProxy({
      url: `/users/${id}/permissions`,
      method: "GET",
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const response = await withAuthProxy({
      url: `/users/${id}/permissions`,
      method: "PUT",
      data: body,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

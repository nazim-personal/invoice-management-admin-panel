import { API_USERS } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await withAuthProxy({
      url: `${API_USERS}/${id}`,
      method: "GET",
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const response = await withAuthProxy({
      url: `${API_USERS}/${id}`,
      method: "PUT",
      data: body,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await withAuthProxy({
      url: `${API_USERS}/${id}`,
      method: "DELETE",
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

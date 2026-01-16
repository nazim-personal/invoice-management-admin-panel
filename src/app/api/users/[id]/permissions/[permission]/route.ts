import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string, permission: string }> }) {
  try {
    const { id, permission } = await params;
    const response = await withAuthProxy({
      url: `/users/${id}/permissions/${permission}`,
      method: "POST",
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string, permission: string }> }) {
  try {
    const { id, permission } = await params;
    const response = await withAuthProxy({
      url: `/users/${id}/permissions/${permission}`,
      method: "DELETE",
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

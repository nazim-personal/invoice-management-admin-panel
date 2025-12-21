import { NextRequest, NextResponse } from "next/server";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { NotificationSettingsApiResponse } from "@/lib/types/notification-settings";

export async function GET() {
  try {
    const response = await withAuthProxy<NotificationSettingsApiResponse>({
      url: "/notification-settings",
      method: "GET",
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await withAuthProxy<NotificationSettingsApiResponse>({
      url: "/notification-settings",
      method: "PUT",
      data: body,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

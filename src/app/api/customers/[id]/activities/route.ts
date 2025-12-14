import { API_CUSTOMERS } from "@/lib/apiEndPoints";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { ApiResponse } from "@/lib/types/api";
import { Activity } from "@/lib/types/activity";
import { nextErrorResponse } from "@/lib/helpers/axios/nextErrorResponse";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const response = await withAuthProxy<ApiResponse<Activity[]>>({
      url: `${API_CUSTOMERS}/${params.id}/activities/`,
      method: "GET",
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

// app/api/dashboard/route.ts
import { API_DASHBOARD_STATS } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { DashboardApiResponseTypes } from "@/lib/types/dashboard";
import { NextResponse } from "next/server";

// GET /api/dashoard/stats
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const response = await withAuthProxy<DashboardApiResponseTypes>({
      url: API_DASHBOARD_STATS,
      method: "GET",
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}
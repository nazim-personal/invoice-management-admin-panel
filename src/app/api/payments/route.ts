import { API_PAYMENTS } from "@/lib/apiEndPoints";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { PaymentsApiResponseTypes, PaymentDataTypes } from "@/lib/types/payments";
import { nextErrorResponse } from "@/lib/helpers/axios/nextErrorResponse";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const per_page = searchParams.get("per_page");

    const params: Record<string, string> = {};
    if (page) params.page = page;
    if (per_page) params.per_page = per_page;

    const response = await withAuthProxy<PaymentsApiResponseTypes<PaymentDataTypes[]>>({
      url: API_PAYMENTS,
      method: "GET",
      params,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

import { API_PAYMENTS_SEARCH } from "@/lib/apiEndPoints";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { PaymentsApiResponseTypes, PaymentDataTypes } from "@/lib/types/payments";
import { nextErrorResponse } from "@/lib/helpers/axios/nextErrorResponse";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const params: Record<string, string> = {};
    const allowedParams = ['q', 'method', 'reference_no', 'start_date', 'end_date', 'page', 'per_page'];

    allowedParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) params[param] = value;
    });

    const response = await withAuthProxy<PaymentsApiResponseTypes<PaymentDataTypes[]>>({
      url: API_PAYMENTS_SEARCH,
      method: "GET",
      params,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

import { API_INVOICES } from "@/lib/apiEndPoints";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { ApiResponse } from "@/lib/types/api";
import { PhonePePaymentResponse } from "@/lib/types/payments";
import { nextErrorResponse } from "@/lib/helpers/axios/nextErrorResponse";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const response = await withAuthProxy<ApiResponse<PhonePePaymentResponse>>({
      url: `${API_INVOICES}/${params.id}/phonepe-payment/`,
      method: "POST",
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

import { API_INVOICES } from "@/lib/apiEndPoints";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { PaymentsApiResponseTypes, PaymentDataTypes } from "@/lib/types/payments";
import { nextErrorResponse } from "@/lib/helpers/axios/nextErrorResponse";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();

    const response = await withAuthProxy<PaymentsApiResponseTypes<PaymentDataTypes>>({
      url: `${API_INVOICES}/${id}/pay/`,
      method: "POST",
      data: body,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

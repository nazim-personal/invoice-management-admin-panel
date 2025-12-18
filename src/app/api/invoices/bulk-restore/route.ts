import { API_INVOICE_RESTORED } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { InvoiceApiResponseTypes } from "@/lib/types/invoices";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await withAuthProxy<InvoiceApiResponseTypes>({
      url: API_INVOICE_RESTORED,
      method: "POST",
      data: body,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

// app/api/invoices/[id]/route.ts
import { API_INVOICES } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { InvoiceApiResponseTypes, InvoiceDetailsApiResponseType } from "@/lib/types/invoices";
import { NextResponse } from "next/server";


export async function GET(req: Request, context: { params: { id: string } }) {
  try {        
    const { id } = await context.params;    
    const response = await withAuthProxy<InvoiceDetailsApiResponseType>({
      url: `${API_INVOICES}/${id}`,
      method: "GET"
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const response = await withAuthProxy<InvoiceApiResponseTypes>({
      url: `${API_INVOICES}/${id}`,
      method: "PUT",
      data: body,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}
// app/api/customers/route.ts
import { API_INVOICES, API_INVOICES_DELETE } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { InvoiceApiResponseTypes } from "@/lib/types/invoices";
import { NextResponse } from "next/server";

// GET /api/invoices
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const q = searchParams.get("q") || undefined;
    const status = searchParams.get("status") || undefined;

    const response = await withAuthProxy<InvoiceApiResponseTypes>({
      url: API_INVOICES,
      method: "GET",
      params: {
        page,
        limit,
        ...(q ? { q } : {}),
        ...(status ? { status } : {}),
      },
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

// POST /api/invoices
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await withAuthProxy<InvoiceApiResponseTypes>({
      url: API_INVOICES,
      method: "POST",
      data: body
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const response = await withAuthProxy<InvoiceApiResponseTypes>({
      url: API_INVOICES_DELETE,
      method: "POST",
      data: body,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}
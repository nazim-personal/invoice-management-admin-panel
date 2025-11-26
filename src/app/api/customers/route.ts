// app/api/customers/route.ts
import { API_CUSTOMER, API_CUSTOMER_DELETE } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { CustomerApiResponseTypes } from "@/lib/types/customers";
import { NextResponse } from "next/server";

// GET /api/customers
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const q = searchParams.get("q") || undefined;
    const status = searchParams.get("status") || undefined;

    const response = await withAuthProxy<CustomerApiResponseTypes>({
      url: API_CUSTOMER,
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

// POST /api/customers
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await withAuthProxy<CustomerApiResponseTypes>({
      url: API_CUSTOMER,
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
    const response = await withAuthProxy<CustomerApiResponseTypes>({
      url: API_CUSTOMER_DELETE,
      method: "POST",
      data: body,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}
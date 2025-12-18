import { API_CUSTOMER_RESTORED } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { CustomerApiResponseTypes } from "@/lib/types/customers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await withAuthProxy<CustomerApiResponseTypes>({
      url: API_CUSTOMER_RESTORED,
      method: "POST",
      data: body,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err)
  }
}

// app/api/invoices/[id]/route.ts
import { API_PRODUCTS } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { ProductDetailsApiResponseType, ProductsApiResponseTypes } from "@/lib/types/products";
import { NextResponse } from "next/server";


export async function GET(req: Request, context: { params: { id: string } }) {
  try {        
    const { id } = await context.params;    
    const response = await withAuthProxy<ProductDetailsApiResponseType>({
      url: `${API_PRODUCTS}/${id}`,
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
    const response = await withAuthProxy<ProductsApiResponseTypes>({
      url: `${API_PRODUCTS}/${id}`,
      method: "PUT",
      data: body,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}
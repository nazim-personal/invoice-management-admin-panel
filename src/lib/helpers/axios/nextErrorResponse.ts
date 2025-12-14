import { NextResponse } from "next/server";

export function nextErrorResponse(err: any) {
  console.error("API Error:", err);
  const status = err.response?.status || 500;
  const message = err.response?.data?.message || err.message || "Internal Server Error";
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

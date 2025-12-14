import { API_PAYMENTS } from "@/lib/apiEndPoints";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { nextErrorResponse } from "@/lib/helpers/axios/nextErrorResponse";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseUrl}${API_PAYMENTS}${params.id}/pdf/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch payment PDF");
    }

    const blob = await response.blob();

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="payment-${params.id}.pdf"`,
      },
    });
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

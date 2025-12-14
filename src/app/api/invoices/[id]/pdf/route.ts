import { API_INVOICES } from "@/lib/apiEndPoints";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { nextErrorResponse } from "@/lib/helpers/axios/nextErrorResponse";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_INVOICES}/${params.id}/pdf/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", `attachment; filename="invoice-${params.id}.pdf"`);

    return new NextResponse(blob, { status: 200, statusText: "OK", headers });

  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

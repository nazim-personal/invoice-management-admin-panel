import { API_INVOICES } from "@/lib/apiEndPoints";
import { nextErrorResponse } from "@/lib/helpers/axios/nextErrorResponse";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await withAuthProxy({
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_INVOICES}/${id}/pdf`,
      method: "GET",
      responseType: "arraybuffer",
    });

    // ✅ handle both axios-response and data-only return
    const binaryData = response?.data ?? response;

    if (!binaryData) {
      throw new Error("PDF binary data not received");
    }

    return new NextResponse(Buffer.from(binaryData), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${id}.pdf"`,
      },
    });
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

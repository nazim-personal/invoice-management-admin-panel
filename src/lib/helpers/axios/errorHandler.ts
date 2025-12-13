// lib/errorHandler.ts
import { NextResponse } from "next/server";

interface ReturnTypes {
  title: string;
  description: string;
}

function formatValidationDetails(details: unknown): string {
  if (!details) return "Validation failed";

  if (typeof details === "string") return details;

  if (Array.isArray(details)) {
    return details.join(" | ");
  }

  if (typeof details === "object" && details !== null) {
    return Object.entries(details)
      .map(([field, msgs]) => {
        if (Array.isArray(msgs)) return `${field}: ${msgs.join(", ")}`;
        if (typeof msgs === "string") return `${field}: ${msgs}`;
        return `${field}: Invalid value`;
      })
      .join(" | ");
  }

  return "Validation error occurred";
}

export const handleApiError = (error: any): ReturnTypes => {
  // Prioritize the message from the API response structure
  // Structure: { success: false, error: { code: "...", message: "...", details: ... } }
  const apiError = error?.error;
  const message = apiError?.message || error?.message || "Something went wrong";
  const details = apiError?.details;

  // If it's a validation error, we might want to show details
  if (apiError?.code === "validation_error" && details) {
    return {
      title: message,
      description: formatValidationDetails(details),
    };
  }

  // For all other errors, use the message from the API
  return {
    title: "Error", // Or use 'message' as title if preferred, but 'Error' + description is standard
    description: message,
  };
};

export function axiosErrorResponse(err: any): NextResponse {
  return NextResponse.json(err.response?.data, { status: err.status });
}
export function nextErrorResponse(err: any): NextResponse {
  const status = err.status || 500;
  if (status >= 500) {
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error: { details: "Something went wrong, please try again later." },
        type: "server_error",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: err?.data?.message || "Request failed",
      error: err?.data?.error || { details: "Unknown error" },
      type: err?.data?.type || "unknown_error",
    },
    { status }
  );
}

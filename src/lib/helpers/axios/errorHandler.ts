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

const ERROR_CODE_MAP: Record<string, string> = {
  invalid_credentials: "Invalid Credentials",
  validation_error: "Validation Error",
  unauthorized: "Unauthorized",
  forbidden: "Forbidden",
  not_found: "Not Found",
  server_error: "Server Error",
};

export const handleApiError = (error: any): ReturnTypes => {
  // Extract data from Axios error if present, otherwise use the error object itself
  const data = error?.response?.data || error;
  const status = error?.response?.status;

  // Prioritize the message from the API response structure
  // Structure: { success: false, error: { code: "...", message: "...", details: ... } }
  const apiError = data?.error;
  let message = apiError?.message || data?.message || error?.message || "Something went wrong";
  const details = apiError?.details;

  // If message is generic and we have a status code, make it more specific
  if ((message === "Something went wrong" || message === "Request failed") && status) {
    message = `Request failed with status ${status}`;
  }

  // If it's a validation error, we might want to show details
  if ((apiError?.code === "validation_error" || data?.type === "validation_error") && details) {
    return {
      title: message,
      description: formatValidationDetails(details),
    };
  }

  // Determine the title based on error code, type, or status
  const errorCode = apiError?.code || data?.code || data?.type;
  const title = ERROR_CODE_MAP[errorCode] || (status === 404 ? "Not Found" : "Error");

  // For all other errors, use the message from the API
  return {
    title: "Error",
    description: message,
  };
};

export function axiosErrorResponse(err: any): NextResponse {
  const status = err.response?.status || 500;
  const data = err.response?.data || { success: false, message: err.message || "Internal Server Error" };
  return NextResponse.json(data, { status });
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

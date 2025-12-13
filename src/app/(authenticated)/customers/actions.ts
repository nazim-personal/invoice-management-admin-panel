
"use server";

import { getCustomerInsightsSummary } from "@/ai/flows/customer-insights-summary";

export async function fetchCustomerInsights(customerName: string) {
  if (!process.env.GEMINI_API_KEY) {
    return "The Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable.";
  }
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = await getCustomerInsightsSummary({ customerName });
    return result.summary;
  } catch (error) {
    console.error("Error fetching customer insights:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "The provided Gemini API key is not valid. Please check your configuration.";
    }
    return "An error occurred while fetching insights. The AI model may be unavailable or the API key may be invalid.";
  }
}

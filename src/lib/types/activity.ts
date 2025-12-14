export type ActivityType = "Invoice" | "Customer" | "Payment" | "Product";

export interface Activity {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>;
  ip_address: string;
  created_at: string;
  user_name: string;
}

// Helper to map entity_type to ActivityType
export function getActivityType(entity_type: string): ActivityType {
  const typeMap: Record<string, ActivityType> = {
    invoice: "Invoice",
    customer: "Customer",
    payment: "Payment",
    product: "Product",
    user: "Customer", // Default fallback
  };
  return typeMap[entity_type.toLowerCase()] || "Customer";
}

// Helper to format action as title
export function formatActivityTitle(action: string, user_name: string): string {
  const actionText = action.replace(/_/g, " ").toLowerCase();
  return `${user_name} ${actionText}`;
}

// Helper to format description
export function formatActivityDescription(activity: Activity): string {
  const details = activity.details;
  if (Object.keys(details).length === 0) {
    return `Action performed on ${activity.entity_type}`;
  }

  const detailsText = Object.entries(details)
    .slice(0, 2)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
  return detailsText;
}


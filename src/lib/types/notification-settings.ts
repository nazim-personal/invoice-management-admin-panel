export interface NotificationSettings {
  id?: string;
  user_id?: string;
  invoice_created: boolean;
  payment_received: boolean;
  invoice_overdue: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationSettingsApiResponse {
  success: boolean;
  message?: string;
  data: {
    results: NotificationSettings;
    meta: Record<string, any>;
  };
}

export interface UpdateNotificationSettingsPayload {
  invoice_created?: boolean;
  payment_received?: boolean;
  invoice_overdue?: boolean;
}

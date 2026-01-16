"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={3000}>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const Icon = variant === "success" ? CheckCircle2 : variant === "destructive" ? XCircle : Info

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-center gap-3">
              <Icon className={`h-4 w-4 shrink-0 ${variant === "success" ? "text-green-500" :
                variant === "destructive" ? "text-red-500" :
                  "text-blue-500"
                }`} />
              <div className="grid gap-1">
                {description && (
                  <ToastDescription className="text-sm font-medium">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

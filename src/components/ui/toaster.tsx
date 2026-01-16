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
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const Icon = variant === "success" ? CheckCircle2 : variant === "destructive" ? XCircle : Info

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-3">
              <div className="mt-0.5">
                <Icon className={`h-5 w-5 ${variant === "success" ? "text-green-500" :
                    variant === "destructive" ? "text-red-500" :
                      "text-blue-500"
                  }`} />
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
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

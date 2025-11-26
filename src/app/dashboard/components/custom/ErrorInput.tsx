import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // If you have a cn utility
import React from "react";

interface ErrorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const ErrorInput = React.forwardRef<HTMLInputElement, ErrorInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <Input
        className={cn(
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
ErrorInput.displayName = "ErrorInput";
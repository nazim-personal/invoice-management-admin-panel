import { cn } from "@/lib/utils"
import { Button } from "./button"
import { PlusCircle } from "lucide-react"

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center animate-fade-in",
                className
            )}
        >
            {icon && (
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                    {icon}
                </div>
            )}
            <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
            {description && (
                <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            {action && (
                <Button onClick={action.onClick} className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    {action.label}
                </Button>
            )}
        </div>
    )
}

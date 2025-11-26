import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center gap-2", className)}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-primary"
    >
      <path d="M2 22V2l20 10L12 14l-4 8 4-4Z" />
      <path d="M2 22 12 2" />
    </svg>
    <span className="text-xl font-bold font-headline text-foreground">
      Invoice Pilot
    </span>
  </div>
);

export default Logo;

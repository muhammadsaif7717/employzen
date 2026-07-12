import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm text-foreground transition-all duration-150 outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground",
        "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:bg-background",
        "hover:border-border/80 hover:bg-muted/70",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:aria-invalid:border-destructive/60 dark:aria-invalid:ring-destructive/30",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-fit w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border-primary/20 [a]:hover:bg-primary/15",
        secondary:
          "bg-secondary/10 text-secondary border-secondary/20 [a]:hover:bg-secondary/15",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20 focus-visible:ring-destructive/20 dark:bg-destructive/15 dark:focus-visible:ring-destructive/30 [a]:hover:bg-destructive/20",
        success:
          "bg-success/10 text-success border-success/20 [a]:hover:bg-success/15",
        warning:
          "bg-warning/10 text-warning-foreground border-warning/20 [a]:hover:bg-warning/15",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Solid variants for action badges
        solid:
          "gradient-brand text-primary-foreground border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

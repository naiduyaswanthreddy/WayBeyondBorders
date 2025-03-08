
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-premium hover:shadow-premium-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-premium hover:shadow-premium-hover",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-premium hover:shadow-premium-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-premium hover:shadow-premium-hover",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-premium-gradient text-white hover:brightness-110 shadow-premium hover:shadow-premium-hover button-shine",
        'premium-outline': "border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 shadow-premium hover:shadow-premium-hover button-shine",
        'premium-blue': "bg-nexus-blue/20 hover:bg-nexus-blue/30 text-nexus-blue-light border border-nexus-blue/30 shadow-premium hover:shadow-premium-hover button-shine",
        'premium-purple': "bg-nexus-purple/20 hover:bg-nexus-purple/30 text-nexus-purple-light border border-nexus-purple/30 shadow-premium hover:shadow-premium-hover button-shine",
        'premium-teal': "bg-nexus-teal/20 hover:bg-nexus-teal/30 text-nexus-teal-light border border-nexus-teal/30 shadow-premium hover:shadow-premium-hover button-shine",
        neo: "bg-card shadow-neo hover:shadow-premium-hover text-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }



import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const SwitchText = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    leftLabel: string
    rightLabel: string
  }
>(({ className, leftLabel, rightLabel, ...props }, ref) => (
  <div className="relative inline-flex items-center">
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-10 w-[240px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-foreground/20",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-9 w-[118px] border border-muted rounded-full bg-background ring-0 transition-transform data-[state=checked]:translate-x-[118px] data-[state=unchecked]:translate-x-0"
        )}
      />
      <span className="absolute left-0 w-[118px] text-sm text-foreground z-10 px-3 py-1.5 rounded-full">
        {leftLabel}
      </span>
      <span className="absolute right-0 w-[118px] text-sm text-foreground z-10 px-3 py-1.5 rounded-full">
        {rightLabel}
      </span>
    </SwitchPrimitives.Root>
  </div>
))

export default SwitchText;
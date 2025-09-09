import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-xl border-2 border-transparent bg-white/60 px-3 py-1 text-base shadow-xs transition-all duration-500 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:scale-[1.03] focus-visible:shadow-lg focus-visible:border-gradient focus-visible:ring-gradient focus-visible:ring-[3px]",
        "aria-invalid:scale-[1.03] aria-invalid:shadow-lg aria-invalid:border-gradient aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "valid:scale-[1.03] valid:shadow-lg valid:border-gradient",
        className
      )}
      {...props}
    />
  )
}

export { Input }

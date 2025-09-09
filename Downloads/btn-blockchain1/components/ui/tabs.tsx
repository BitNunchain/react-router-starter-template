"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative bg-gradient-to-r from-indigo-200 via-blue-200 to-purple-200 text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl border-2 border-transparent p-[3px] overflow-hidden group shadow-lg transition-all duration-500 hover:shadow-2xl focus-within:shadow-2xl hover:border-gradient focus-within:border-gradient",
        className
      )}
      {...props}
    >
      {/* Animated gradient overlay */}
      <span className="absolute inset-0 pointer-events-none z-0 animate-gradient-move opacity-30 group-hover:opacity-50 tabs-animated-gradient" />
      <span className="relative z-10">{props.children}</span>
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-400 data-[state=active]:via-blue-400 data-[state=active]:to-purple-400 data-[state=active]:text-white data-[state=active]:shadow-xl hover:scale-105 hover:shadow-2xl focus:shadow-2xl rounded-xl border-2 border-transparent hover:border-gradient focus:border-gradient",
        "data-[state=active]:border-transparent text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 border px-2 py-1 text-sm font-medium whitespace-nowrap focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{props.children}</span>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

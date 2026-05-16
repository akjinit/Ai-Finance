"use client"


import { Progress } from "@/components/ui/progress"

export function ProgressBar({ percentageUsed }) {
    return (
      <Progress
        value={percentageUsed}
        indicatorClassName={
          percentageUsed < 50
            ? "bg-green-500"
            : percentageUsed < 80
            ? "bg-yellow-500"
            : "bg-red-500"
        }
      />
    )
}

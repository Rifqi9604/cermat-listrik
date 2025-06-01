"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PowerForecast } from "@/types/api"
import { TrendingUp, Zap } from "lucide-react"

interface PowerChartProps {
  data: PowerForecast[]
  title?: string
  className?: string
}

export function PowerChart({ data, title = "Power Consumption", className }: PowerChartProps) {
  const maxPower = Math.max(...data.map((d) => d.power))
  const minPower = Math.min(...data.map((d) => d.power))

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPower = (power: number) => {
    return `${power.toFixed(1)}W`
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-4 w-4 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">Peak: {formatPower(maxPower)}</span>
          </div>
          <span className="text-muted-foreground">Low: {formatPower(minPower)}</span>
        </div>

        <div className="space-y-2">
          {data.slice(0, 6).map((point, index) => {
            const percentage = ((point.power - minPower) / (maxPower - minPower)) * 100

            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{formatTime(point.timestamp)}</span>
                  <span className="font-medium">{formatPower(point.power)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

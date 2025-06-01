"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEnergySavings, type EnergySavingTip } from "@/hooks/use-energy-savings"
import type { Device } from "@/types/api"
import { Lightbulb, TrendingDown } from "lucide-react"

interface EnergySavingsPanelProps {
  devices: Device[]
  className?: string
}

export function EnergySavingsPanel({ devices, className }: EnergySavingsPanelProps) {
  const { tips, totalPotentialSavings } = useEnergySavings(devices)

  const getDifficultyColor = (difficulty: EnergySavingTip["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Energy Saving Tips
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <TrendingDown className="h-3 w-3 mr-1" />
            {totalPotentialSavings.toFixed(0)}% savings
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip) => (
          <div key={tip.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm">{tip.title}</h4>
              <Badge className={getDifficultyColor(tip.difficulty)} variant="secondary">
                {tip.difficulty}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{tip.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-600 font-medium">Up to {tip.potentialSavings}% savings</span>
              <Button size="sm" variant="outline" className="h-6 text-xs">
                Apply
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Device } from "@/types/api"
import { Lightbulb, Snowflake, Refrigerator, Wifi, WifiOff, TrendingUp, Zap } from "lucide-react"

interface DeviceCardProps {
  device: Device
  onViewDetails: (deviceId: string) => void
  className?: string
}

export function DeviceCard({ device, onViewDetails, className }: DeviceCardProps) {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "lighting":
        return <Lightbulb className="h-4 w-4" />
      case "cooling":
        return <Snowflake className="h-4 w-4" />
      case "appliance":
        return <Refrigerator className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getPowerColor = (power: number) => {
    if (power < 50) return "text-green-600"
    if (power < 200) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            {getDeviceIcon(device.type)}
            {device.name}
          </CardTitle>
          <Badge variant={device.status === "online" ? "default" : "secondary"}>
            {device.status === "online" ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
            {device.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Power</span>
          <span className={`font-bold ${getPowerColor(device.currentPower)}`}>{device.currentPower.toFixed(1)}W</span>
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={() => onViewDetails(device.id)}>
          <TrendingUp className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

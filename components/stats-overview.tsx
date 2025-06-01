"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Device } from "@/types/api"
import { Zap, TrendingDown, AlertTriangle, Wifi } from "lucide-react"

interface StatsOverviewProps {
  devices: Device[]
  anomalyCount: number
  className?: string
}

export function StatsOverview({ devices, anomalyCount, className }: StatsOverviewProps) {
  const totalPower = devices.reduce((sum, device) => sum + device.currentPower, 0)
  const onlineDevices = devices.filter((device) => device.status === "online").length
  const estimatedMonthlyCost = (totalPower * 24 * 30 * 1500) / 1000 // Assuming 1500 IDR per kWh

  const stats = [
    {
      title: "Total Power",
      value: `${totalPower.toFixed(1)}W`,
      icon: Zap,
      color: "text-blue-600",
    },
    {
      title: "Monthly Cost",
      value: `Rp ${estimatedMonthlyCost.toLocaleString("id-ID")}`,
      icon: TrendingDown,
      color: "text-green-600",
    },
    {
      title: "Online Devices",
      value: `${onlineDevices}/${devices.length}`,
      icon: Wifi,
      color: "text-purple-600",
    },
    {
      title: "Anomalies",
      value: anomalyCount.toString(),
      icon: AlertTriangle,
      color: "text-orange-600",
    },
  ]

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-lg font-bold">{stat.value}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

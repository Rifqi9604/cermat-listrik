"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { AnomalyDetection } from "@/types/api"
import { AlertTriangle, Clock, Wifi, WifiOff } from "lucide-react"

interface AnomalyAlertsProps {
  anomalies: AnomalyDetection[]
  connected: boolean
  className?: string
}

export function AnomalyAlerts({ anomalies, connected, className }: AnomalyAlertsProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Anomaly Detection
          </CardTitle>
          <Badge variant={connected ? "default" : "secondary"}>
            {connected ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
            {connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {anomalies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No anomalies detected</p>
          </div>
        ) : (
          <div className="space-y-3">
            {anomalies.map((anomaly, index) => (
              <Alert key={index} className="border-orange-200">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <AlertDescription className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTime(anomaly.timestamp_start)}
                  </div>
                  <p className="text-sm">{anomaly.message}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">Feature: {anomaly.most_anomalous_feature}</Badge>
                    <Badge variant="outline">Error: {anomaly.reconstruction_error.toFixed(3)}</Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

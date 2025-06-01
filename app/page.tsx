"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { StatsOverview } from "@/components/stats-overview"
import { DeviceCard } from "@/components/device-card"
import { PowerChart } from "@/components/power-chart"
import { AnomalyAlerts } from "@/components/anomaly-alerts"
import { EnergySavingsPanel } from "@/components/energy-savings-panel"
import { EnergyReportModal } from "@/components/energy-report-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDevices } from "@/hooks/use-devices"
import { usePowerForecast } from "@/hooks/use-power-forecast"
import { useAnomalyDetection } from "@/hooks/use-anomaly-detection"
import { RefreshCw, Settings, FileText, Lightbulb, Calendar } from "lucide-react"

export default function HomePage() {
  const [selectedDevice, setSelectedDevice] = useState<string>("anonymous-smartlamp-001")
  const [forecastHorizon, setForecastHorizon] = useState<number>(300)

  const { devices, loading: devicesLoading } = useDevices()
  const {
    data: forecastData,
    loading: forecastLoading,
    refetch,
  } = usePowerForecast(selectedDevice, {
    starts_at: Math.floor(Date.now() / 1000),
    horizon: forecastHorizon,
  })
  const { anomalies, connected } = useAnomalyDetection(selectedDevice)

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId)
  }

  const handleRefresh = () => {
    refetch({
      starts_at: Math.floor(Date.now() / 1000),
      horizon: forecastHorizon,
    })
  }

  if (devicesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <Header />
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading devices...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <Header />

        <StatsOverview devices={devices} anomalyCount={anomalies.length} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-base">Power Forecast</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={forecastHorizon.toString()}
                      onValueChange={(value) => setForecastHorizon(Number(value))}
                    >
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 min</SelectItem>
                        <SelectItem value="300">5 min</SelectItem>
                        <SelectItem value="600">10 min</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={forecastLoading}>
                      <RefreshCw className={`h-4 w-4 ${forecastLoading ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {forecastLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Loading forecast...</p>
                  </div>
                ) : forecastData?.forecast ? (
                  <PowerChart data={forecastData.forecast} />
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <p className="text-sm">No forecast data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Connected Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {devices.map((device) => (
                    <DeviceCard key={device.id} device={device} onViewDetails={handleDeviceSelect} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <AnomalyAlerts anomalies={anomalies} connected={connected} />

            <EnergySavingsPanel devices={devices} />

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <EnergyReportModal devices={devices}>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </EnergyReportModal>

                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Optimization
                </Button>

                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Smart Recommendations
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useCallback } from "react"
import type { Device } from "@/types/api"

export interface EnergyReport {
  period: "daily" | "weekly" | "monthly"
  totalConsumption: number // kWh
  totalCost: number // IDR
  averagePower: number // W
  peakPower: number // W
  deviceBreakdown: Array<{
    deviceId: string
    deviceName: string
    consumption: number
    percentage: number
  }>
  trends: Array<{
    date: string
    consumption: number
  }>
}

export function useEnergyReports() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateReport = useCallback(
    async (devices: Device[], period: "daily" | "weekly" | "monthly"): Promise<EnergyReport> => {
      setLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const periodMultiplier = period === "daily" ? 1 : period === "weekly" ? 7 : 30
        const totalPower = devices.reduce((sum, device) => sum + device.currentPower, 0)
        const totalConsumption = (totalPower * 24 * periodMultiplier) / 1000 // kWh
        const totalCost = totalConsumption * 1500 // IDR per kWh

        const deviceBreakdown = devices.map((device) => {
          const consumption = (device.currentPower * 24 * periodMultiplier) / 1000
          return {
            deviceId: device.id,
            deviceName: device.name,
            consumption,
            percentage: (consumption / totalConsumption) * 100,
          }
        })

        const trends = Array.from({ length: periodMultiplier }, (_, i) => ({
          date: new Date(Date.now() - (periodMultiplier - i - 1) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          consumption: totalConsumption / periodMultiplier + (Math.random() - 0.5) * 2,
        }))

        return {
          period,
          totalConsumption,
          totalCost,
          averagePower: totalPower,
          peakPower: totalPower * 1.3,
          deviceBreakdown,
          trends,
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate report")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { generateReport, loading, error }
}

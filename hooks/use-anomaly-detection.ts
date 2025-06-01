"use client"

import { useState, useEffect, useCallback } from "react"
import type { AnomalyDetection, ApiError } from "@/types/api"

export function useAnomalyDetection(deviceId: string) {
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const generateMockAnomaly = useCallback((): AnomalyDetection => {
    const now = Math.floor(Date.now() / 1000)
    const features = ["power_consumption", "voltage", "current", "frequency"]
    const messages = [
      "Unusual power spike detected",
      "Power consumption below normal range",
      "Voltage fluctuation detected",
      "Irregular usage pattern identified",
    ]

    return {
      timestamp_start: now - Math.floor(Math.random() * 3600),
      timestamp_end: now,
      reconstruction_error: Math.random() * 0.1 + 0.01,
      most_anomalous_feature: features[Math.floor(Math.random() * features.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
    }
  }, [])

  useEffect(() => {
    if (!deviceId) return

    // Simulate connection
    setConnected(true)
    setError(null)

    // Generate initial anomalies
    const initialAnomalies = Array.from({ length: 2 }, () => generateMockAnomaly())
    setAnomalies(initialAnomalies)

    // Simulate periodic anomaly detection
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance of new anomaly
        const newAnomaly = generateMockAnomaly()
        setAnomalies((prev) => [newAnomaly, ...prev].slice(0, 10))
      }
    }, 10000) // Check every 10 seconds

    return () => {
      clearInterval(interval)
      setConnected(false)
    }
  }, [deviceId, generateMockAnomaly])

  return { anomalies, connected, error }
}

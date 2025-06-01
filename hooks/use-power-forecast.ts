"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { ForecastResponse, ForecastParams, ApiError } from "@/types/api"

export function usePowerForecast(deviceId: string, params?: ForecastParams) {
  const [data, setData] = useState<ForecastResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const paramsRef = useRef(params)

  // Update params ref when params change
  useEffect(() => {
    paramsRef.current = params
  }, [params])

  const fetchForecast = useCallback(
    async (customParams?: ForecastParams) => {
      if (!deviceId) return

      setLoading(true)
      setError(null)

      try {
        const finalParams = customParams || paramsRef.current

        // Mock data generation for demonstration
        const mockForecast = Array.from({ length: 12 }, (_, i) => ({
          timestamp: (finalParams?.starts_at || Math.floor(Date.now() / 1000)) + i * 300,
          power: Math.random() * 100 + 50 + Math.sin(i * 0.5) * 20,
        }))

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        const result: ForecastResponse = {
          forecast: mockForecast,
        }

        setData(result)
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : "Failed to fetch forecast data",
        })
      } finally {
        setLoading(false)
      }
    },
    [deviceId],
  )

  useEffect(() => {
    if (deviceId && params) {
      fetchForecast()
    }
  }, [deviceId, fetchForecast, params])

  return { data, loading, error, refetch: fetchForecast }
}

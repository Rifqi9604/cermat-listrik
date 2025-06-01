"use client"

import { useState, useEffect } from "react"
import type { Device, ApiError } from "@/types/api"

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    // Mock data with realistic power consumption
    const mockDevices: Device[] = [
      {
        id: "anonymous-smartlamp-001",
        name: "Smart Lamp Living Room",
        type: "lighting",
        status: "online",
        currentPower: 12.5,
      },
      {
        id: "anonymous-ac-001",
        name: "Air Conditioner",
        type: "cooling",
        status: "online",
        currentPower: 850.0,
      },
      {
        id: "anonymous-fridge-001",
        name: "Refrigerator",
        type: "appliance",
        status: "online",
        currentPower: 120.0,
      },
      {
        id: "anonymous-tv-001",
        name: "Smart TV",
        type: "entertainment",
        status: "online",
        currentPower: 85.0,
      },
    ]

    setTimeout(() => {
      setDevices(mockDevices)
      setLoading(false)
    }, 1000)

    // Simulate real-time power updates
    const interval = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((device) => ({
          ...device,
          currentPower: device.currentPower + (Math.random() - 0.5) * 10,
          status: Math.random() > 0.95 ? (device.status === "online" ? "offline" : "online") : device.status,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return { devices, loading, error }
}

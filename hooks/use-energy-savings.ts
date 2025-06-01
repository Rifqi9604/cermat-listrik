"use client"

import { useState, useEffect } from "react"
import type { Device } from "@/types/api"

export interface EnergySavingTip {
  id: string
  title: string
  description: string
  potentialSavings: number // in percentage
  difficulty: "easy" | "medium" | "hard"
  category: string
}

export function useEnergySavings(devices: Device[]) {
  const [tips, setTips] = useState<EnergySavingTip[]>([])
  const [totalPotentialSavings, setTotalPotentialSavings] = useState(0)

  useEffect(() => {
    const generateTips = (): EnergySavingTip[] => {
      const baseTips: EnergySavingTip[] = [
        {
          id: "1",
          title: "Optimize AC Temperature",
          description: "Set AC to 24°C instead of 20°C to save energy",
          potentialSavings: 20,
          difficulty: "easy",
          category: "cooling",
        },
        {
          id: "2",
          title: "Use LED Lighting",
          description: "Replace incandescent bulbs with LED lights",
          potentialSavings: 75,
          difficulty: "easy",
          category: "lighting",
        },
        {
          id: "3",
          title: "Unplug Standby Devices",
          description: "Unplug electronics when not in use to avoid phantom load",
          potentialSavings: 10,
          difficulty: "easy",
          category: "general",
        },
        {
          id: "4",
          title: "Smart Scheduling",
          description: "Use timers to automatically turn off devices",
          potentialSavings: 15,
          difficulty: "medium",
          category: "automation",
        },
      ]

      // Filter tips based on available devices
      return baseTips.filter((tip) => {
        if (tip.category === "cooling") return devices.some((d) => d.type === "cooling")
        if (tip.category === "lighting") return devices.some((d) => d.type === "lighting")
        return true
      })
    }

    const generatedTips = generateTips()
    setTips(generatedTips)

    const avgSavings = generatedTips.reduce((sum, tip) => sum + tip.potentialSavings, 0) / generatedTips.length
    setTotalPotentialSavings(avgSavings)
  }, [devices])

  return { tips, totalPotentialSavings }
}

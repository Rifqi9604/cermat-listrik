"use client"

import { Card } from "@/components/ui/card"
import { Zap } from "lucide-react"

export function Header() {
  return (
    <Card className="border-0 shadow-none bg-gradient-to-r from-green-50 to-blue-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Cermat LISTRIK</h1>
        </div>
        <p className="text-gray-600 text-sm">Smart electricity monitoring for efficient home energy management</p>
      </div>
    </Card>
  )
}

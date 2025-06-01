export interface PowerForecast {
  timestamp: number
  power: number
}

export interface ForecastResponse {
  forecast: PowerForecast[]
}

export interface ForecastParams {
  starts_at: number
  horizon: number // 60, 300, 600
}

export interface AnomalyDetection {
  timestamp_start: number
  timestamp_end: number
  reconstruction_error: number
  most_anomalous_feature: string
  message: string
}

export interface Device {
  id: string
  name: string
  type: string
  status: "online" | "offline"
  currentPower: number
}

export interface ApiError {
  message: string
  code?: string
}

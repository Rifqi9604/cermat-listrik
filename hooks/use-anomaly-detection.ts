"use client";

import { useState, useEffect, useRef } from "react";
import type { AnomalyDetection, ApiError } from "@/types/api";

export function useAnomalyDetection(deviceId: string) {
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!deviceId) return;

    const connectWebSocket = () => {
      try {
        // Connect to the actual WebSocket endpoint
        wsRef.current = new WebSocket(
          `ws://broker.emqx.io:8083/${deviceId}/anomalies`
        );

        wsRef.current.onopen = () => {
          console.log("WebSocket connected");
          setConnected(true);
          setError(null);
        };

        wsRef.current.onmessage = (event) => {
          try {
            const anomaly: AnomalyDetection = JSON.parse(event.data);
            setAnomalies((prev) => [anomaly, ...prev].slice(0, 10)); // Keep last 10 anomalies
          } catch (err) {
            console.error("Failed to parse anomaly data:", err);
          }
        };

        wsRef.current.onerror = (event) => {
          console.error("WebSocket error:", event);
          setError({ message: "WebSocket connection error" });
          setConnected(false);
        };

        wsRef.current.onclose = () => {
          console.log("WebSocket closed");
          setConnected(false);
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };
      } catch (err) {
        console.error("WebSocket connection failed:", err);
        setError({
          message:
            err instanceof Error
              ? err.message
              : "Failed to connect to anomaly detection",
        });

        // Fallback to mock data for development/demo purposes
        if (process.env.NODE_ENV === "development") {
          setConnected(true);
          const mockInterval = setInterval(() => {
            if (Math.random() < 0.3) {
              const now = Math.floor(Date.now() / 1000);
              const features = [
                "power_consumption",
                "voltage",
                "current",
                "frequency",
              ];
              const messages = [
                "Unusual power spike detected",
                "Power consumption below normal range",
                "Voltage fluctuation detected",
                "Irregular usage pattern identified",
              ];

              const newAnomaly: AnomalyDetection = {
                timestamp_start: now - Math.floor(Math.random() * 3600),
                timestamp_end: now,
                reconstruction_error: Math.random() * 0.1 + 0.01,
                most_anomalous_feature:
                  features[Math.floor(Math.random() * features.length)],
                message: messages[Math.floor(Math.random() * messages.length)],
              };

              setAnomalies((prev) => [newAnomaly, ...prev].slice(0, 10));
            }
          }, 10000);

          return () => clearInterval(mockInterval);
        }
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [deviceId]);

  return { anomalies, connected, error };
}

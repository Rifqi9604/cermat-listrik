"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ForecastResponse, ForecastParams, ApiError } from "@/types/api";

// Ganti dengan URL Azure server yang sebenarnya
const AZURE_SERVER =
  process.env.NEXT_PUBLIC_AZURE_SERVER || "https://AZURE_SERVER";

export function usePowerForecast(deviceId: string, params?: ForecastParams) {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const paramsRef = useRef(params);

  // Update params ref when params change
  // Update params ref when params change
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const fetchForecast = useCallback(
    async (customParams?: ForecastParams) => {
      if (!deviceId) return;

      setLoading(true);
      setError(null);

      try {
        const finalParams = customParams || paramsRef.current;
        const queryParams = new URLSearchParams();

        if (finalParams?.starts_at) {
          queryParams.append("starts_at", finalParams.starts_at.toString());
        }
        if (finalParams?.horizon) {
          queryParams.append("horizon", finalParams.horizon.toString());
        }

        // Fetch data from the actual endpoint
        const response = await fetch(
          `${AZURE_SERVER}/forecast/${deviceId}?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ForecastResponse = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching forecast data:", err);
        setError({
          message:
            err instanceof Error
              ? err.message
              : "Failed to fetch forecast data",
        });

        // Fallback to mock data for development/demo purposes
        if (process.env.NODE_ENV === "development") {
          const mockForecast = Array.from({ length: 12 }, (_, i) => ({
            timestamp:
              (paramsRef.current?.starts_at || Math.floor(Date.now() / 1000)) +
              i * 300,
            power: Math.random() * 100 + 50 + Math.sin(i * 0.5) * 20,
          }));

          setData({ forecast: mockForecast });
        }
      } finally {
        setLoading(false);
      }
    },
    [deviceId]
  );

  useEffect(() => {
    if (deviceId && params) {
      fetchForecast();
    }
  }, [deviceId, fetchForecast, params]);

  return { data, loading, error, refetch: fetchForecast };
}

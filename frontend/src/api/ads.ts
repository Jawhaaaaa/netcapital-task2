import type { CarExportResponse } from '../types'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
})

export async function getMakes(): Promise<string[]> {
  const { data } = await api.get<string[]>('/api/vehicles/makes')
  return data
}

export async function getModels(make?: string): Promise<string[]> {
  const params: Record<string, string> = {}
  if (make) params.make = make
  const { data } = await api.get<string[]>('/api/vehicles/models', { params })
  return data
}

export async function searchAds(
  make?: string,
  model?: string,
  page: number = 1,
): Promise<CarExportResponse> {
  const params: Record<string, string> = { page: String(page) }
  if (make) params.make = make
  if (model) params.model = model
  const { data } = await api.get<CarExportResponse>('/api/ads/search', { params })
  return data
}

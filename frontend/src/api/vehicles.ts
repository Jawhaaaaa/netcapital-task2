import axios from 'axios'
import type { Vehicle } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
})

export async function fetchVehicle(plate: string): Promise<Vehicle> {
  const { data } = await api.get<Vehicle>(`/api/vehicles/${encodeURIComponent(plate)}`)
  return data
}

export async function searchVehicle(type: 'plate' | 'vin', value: string): Promise<Vehicle> {
  const { data } = await api.get<Vehicle>('/api/vehicles/search', {
    params: { type, value },
  })
  return data
}

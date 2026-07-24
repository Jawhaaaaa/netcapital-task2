import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
})

export async function getMakes(): Promise<string[]> {
  const { data } = await api.get<string[]>('/api/vehicles/makes')
  return data
}

export async function getModels(make: string): Promise<string[]> {
  const { data } = await api.get<string[]>('/api/vehicles/models', {
    params: { make },
  })
  return data
}

export async function searchAds(make: string, model: string): Promise<{ redirect_url: string }> {
  const { data } = await api.get<{ redirect_url: string }>('/api/ads/search', {
    params: { make, model },
  })
  return data
}

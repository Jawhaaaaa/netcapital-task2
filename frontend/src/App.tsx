import { useState } from 'react'
import type { Vehicle } from './types'
import { searchVehicle } from './api/vehicles'
import SearchBar from './components/SearchBar'
import VehicleResultCard from './components/VehicleResultCard'

function App() {
  const [searchType, setSearchType] = useState<'plate' | 'vin'>('plate')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [error, setError] = useState<'not_found' | 'server_error' | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    setVehicle(null)
    setError(null)
    try {
      const data = await searchVehicle(searchType, value)
      setVehicle(data)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number } }
        if (axiosErr.response?.status === 404) {
          setError('not_found')
        } else {
          setError('server_error')
        }
      } else {
        setError('server_error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SearchBar
        value={value}
        onChange={setValue}
        onSearch={handleSearch}
        searchType={searchType}
        onSearchTypeChange={setSearchType}
      />

      {loading && (
        <div className="flex justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {error === 'not_found' && !loading && (
        <p className="text-center text-gray-600 text-lg py-12">
          Мэдээлэл олдсонгүй
        </p>
      )}

      {error === 'server_error' && !loading && (
        <p className="text-center text-red-600 text-lg py-12">
          Алдаа гарлаа. Дахин оролдоно уу.
        </p>
      )}

      {vehicle && !loading && (
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
          <VehicleResultCard vehicle={vehicle} />
        </div>
      )}
    </div>
  )
}

export default App

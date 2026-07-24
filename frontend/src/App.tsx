import { useState } from 'react'
import type { Vehicle } from './types'
import Header from './components/Header'
import MainSearchPage from './components/MainSearchPage'
import AdsSearchPage from './components/AdsSearchPage'

function App() {
  const [page, setPage] = useState<'home' | 'ads'>('home')
  const [lastVehicle, setLastVehicle] = useState<Vehicle | null>(null)

  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentPage={page} onNavigate={setPage} />
      {page === 'home' ? (
        <MainSearchPage onVehicleFound={(v) => setLastVehicle(v)} />
      ) : (
        <AdsSearchPage
          initialMake={lastVehicle?.make ?? undefined}
          initialModel={lastVehicle?.model ?? undefined}
        />
      )}
    </div>
  )
}

export default App

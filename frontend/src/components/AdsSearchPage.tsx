import { useEffect, useState } from 'react'
import { getMakes, getModels, searchAds } from '../api/ads'

interface Props {
  initialMake?: string
  initialModel?: string
}

export default function AdsSearchPage({ initialMake, initialModel }: Props) {
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [selectedMake, setSelectedMake] = useState(initialMake ?? '')
  const [selectedModel, setSelectedModel] = useState(initialModel ?? '')
  const [loadingMakes, setLoadingMakes] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState<{ redirect_url: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMakes()
      .then((data) => {
        setMakes(data)
        if (initialMake && data.includes(initialMake)) {
          setSelectedMake(initialMake)
        }
      })
      .catch(() => setError('Марк жагсаалт татахад алдаа гарлаа'))
      .finally(() => setLoadingMakes(false))

    getModels()
      .then((data) => setModels(data))
      .catch(() => {})
  }, [initialMake])

  useEffect(() => {
    setLoadingModels(true)
    ;(selectedMake ? getModels(selectedMake) : getModels())
      .then((data) => {
        setModels(data)
        if (!data.includes(selectedModel)) {
          setSelectedModel('')
        }
      })
      .catch(() => setError('Модель жагсаалт татахад алдаа гарлаа'))
      .finally(() => setLoadingModels(false))
  }, [selectedMake])

  const handleSearch = async () => {
    if (!selectedMake && !selectedModel) return
    setSearching(true)
    setResult(null)
    setError(null)
    try {
      const data = await searchAds(
        selectedMake || undefined,
        selectedModel || undefined,
      )
      setResult(data)
    } catch {
      setError('Зар татахад алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setSearching(false)
    }
  }

  const canSearch = Boolean(selectedMake || selectedModel)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-xl mx-auto px-4 pt-20 pb-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Зар хайх</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Марк</label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none"
                disabled={loadingMakes}
              >
                <option value="">Бүх марк</option>
                {makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Модель</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none"
                disabled={loadingModels}
              >
                <option value="">Бүх загвар</option>
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSearch}
              disabled={!canSearch || searching}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {searching ? 'Хайж байна...' : 'Хайх'}
            </button>
          </div>

          {searching && (
            <div className="flex flex-col items-center py-8 gap-3">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-gray-500 text-sm text-center">
                Зар хайж байна... эхний хайлт удаан байж болно (up to 30-40 секунд)
              </p>
            </div>
          )}

          {error && !searching && (
            <p className="text-center text-red-600 text-sm mt-4">{error}</p>
          )}

          {result && !searching && (
            <div className="mt-6 text-center space-y-3">
              <a
                href={result.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Зар харах
              </a>
              <p className="text-gray-400 text-xs break-all">{result.redirect_url}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

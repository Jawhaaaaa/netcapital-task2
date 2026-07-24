import { useCallback, useEffect, useRef, useState } from 'react'
import { SearchX } from 'lucide-react'
import type { CarAd, CarExportResponse } from '../types'
import { getMakes, getModels, searchAds } from '../api/ads'
import AdCard from './AdCard'

interface Props {
  initialMake?: string
  initialModel?: string
}

type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export default function AdsSearchPage({ initialMake, initialModel }: Props) {
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [selectedMake, setSelectedMake] = useState(initialMake ?? '')
  const [selectedModel, setSelectedModel] = useState(initialModel ?? '')
  const [loadingMakes, setLoadingMakes] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle')
  const [results, setResults] = useState<CarAd[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [searching, setSearching] = useState(false)

  const lastSearchRef = useRef({ make: '', model: '' })

  useEffect(() => {
    getMakes()
      .then((data) => {
        setMakes(data)
        if (initialMake && data.includes(initialMake)) {
          setSelectedMake(initialMake)
        }
      })
      .catch(() => setErrorMessage('Марк жагсаалт татахад алдаа гарлаа'))
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
      .catch(() => setErrorMessage('Модель жагсаалт татахад алдаа гарлаа'))
      .finally(() => setLoadingModels(false))
  }, [selectedMake])

  const doSearch = useCallback(
    async (make: string, model: string, pageNum: number, append: boolean) => {
      setSearching(true)
      setErrorMessage('')
      if (!append) {
        setSearchStatus('loading')
      }
      try {
        const data: CarExportResponse = await searchAds(
          make || undefined,
          model || undefined,
          pageNum,
        )
        if (data.cars.length === 0) {
          setSearchStatus('empty')
          setResults([])
          setTotal(0)
          setPage(1)
          setTotalPages(0)
        } else {
          setResults((prev) => (append ? [...prev, ...data.cars] : data.cars))
          setTotal(data.total)
          setPage(data.page)
          setTotalPages(data.pages)
          setSearchStatus('success')
        }
      } catch (err: unknown) {
        const axiosErr = err as { response?: { status?: number } }
        if (axiosErr.response?.status === 504) {
          setErrorMessage('Зарын үйлчилгээ хариу өгсөнгүй. Дахин оролдоно уу.')
        } else {
          setErrorMessage('Алдаа гарлаа.')
        }
        setSearchStatus('error')
      } finally {
        setSearching(false)
      }
    },
    [],
  )

  const handleSearch = () => {
    if (!selectedMake && !selectedModel) return
    lastSearchRef.current = { make: selectedMake, model: selectedModel }
    doSearch(selectedMake, selectedModel, 1, false)
  }

  const handleRetry = () => {
    doSearch(
      lastSearchRef.current.make,
      lastSearchRef.current.model,
      1,
      false,
    )
  }

  const handleNextPage = () => {
    doSearch(selectedMake, selectedModel, page + 1, true)
  }

  const canSearch = Boolean(selectedMake || selectedModel)

  const skeleton = (key: number) => (
    <div key={key} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
      <div className="flex items-end justify-between">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded-full w-28" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        {/* Search controls card */}
        <div className="max-w-xl mx-auto mb-8">
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

            {searching && searchStatus !== 'loading' && (
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
          </div>
        </div>

        {/* Results area */}
        {searchStatus === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map(skeleton)}
          </div>
        )}

        {searchStatus === 'empty' && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <SearchX className="h-10 w-10" style={{ color: 'var(--color-steel)' }} />
            <p className="text-gray-500 text-base">Энэ маркад тохирох зар олдсонгүй</p>
          </div>
        )}

        {searchStatus === 'error' && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-amber-600 text-base">{errorMessage}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Дахин оролдох
            </button>
          </div>
        )}

        {searchStatus === 'success' && (
          <div>
            <p
              className="text-sm font-medium mb-4"
              style={{ color: 'var(--color-steel)' }}
            >
              {total} зар олдлоо
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((ad, idx) => (
                <div
                  key={`${ad.link}-${idx}`}
                  className="ad-card-enter"
                  style={{ animationDelay: `${Math.min(idx * 60, 600)}ms` }}
                >
                  <AdCard ad={ad} />
                </div>
              ))}
            </div>
            {page < totalPages && !searching && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleNextPage}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Дараагийн хуудас
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface Props {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  searchType: 'plate' | 'vin'
  onSearchTypeChange: (type: 'plate' | 'vin') => void
}

export default function SearchBar({ value, onChange, onSearch, searchType, onSearchTypeChange }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) onSearch()
  }

  return (
    <div className="bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 pt-16 pb-20">
      <h1 className="text-white text-3xl font-bold text-center mb-6">
        МЭДЭЭЛЭЛ ХАРАХ
      </h1>
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md -mb-12 relative z-10">
          <form onSubmit={handleSubmit} className="flex items-center gap-0 w-full">
            <select
              value={searchType}
              onChange={(e) => onSearchTypeChange(e.target.value as 'plate' | 'vin')}
              className="bg-gray-100 text-gray-700 text-sm px-3 py-3 rounded-l-lg border-r border-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="plate">Улсын дугаар</option>
              <option value="vin">Арлын дугаар</option>
            </select>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={searchType === 'plate' ? 'Улсын дугаар оруулна уу' : 'Арлын дугаар оруулна уу'}
              className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-3 rounded-r-lg transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

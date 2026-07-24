interface Props {
  currentPage: 'home' | 'ads'
  onNavigate: (page: 'home' | 'ads') => void
}

export default function Header({ currentPage, onNavigate }: Props) {
  return (
    <nav className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <span className="font-bold text-lg text-gray-900">AutoBox Demo</span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('home')}
          className={
            currentPage === 'home'
              ? 'font-bold text-blue-700 underline'
              : 'text-gray-600 hover:text-gray-900'
          }
        >
          Мэдээлэл хайх
        </button>
        <button
          onClick={() => onNavigate('ads')}
          className={
            currentPage === 'ads'
              ? 'font-bold text-blue-700 underline'
              : 'text-gray-600 hover:text-gray-900'
          }
        >
          Зар хайх
        </button>
      </div>
    </nav>
  )
}

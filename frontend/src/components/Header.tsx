import { Search, Tag } from 'lucide-react'

interface Props {
  currentPage: 'home' | 'ads'
  onNavigate: (page: 'home' | 'ads') => void
}

export default function Header({ currentPage, onNavigate }: Props) {
  return (
    <nav
      className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--color-navy)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Left side — wordmark */}
      <div className="flex flex-col">
        <span className="text-lg leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span style={{ color: '#fff', fontWeight: 500 }}>Auto</span>
          <span
            style={{
              color: 'var(--color-amber)',
              fontWeight: 700,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Box
          </span>
        </span>
        <span
          className="hidden sm:block text-[11px] uppercase tracking-widest leading-tight"
          style={{ color: 'var(--color-steel)' }}
        >
          ТЭЭВРИЙН ХЭРЭГСЛИЙН МЭДЭЭЛЭЛ
        </span>
      </div>

      {/* Right side — segmented pill toggle */}
      <div
        className="relative flex items-center rounded-full"
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          padding: '4px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
        }}
      >
        {/* Sliding active pill */}
        <div
          className="absolute top-[4px] bottom-[4px] w-1/2 rounded-full transition-all duration-250 ease-out"
          style={{
            backgroundColor: '#fff',
            transform: currentPage === 'home' ? 'translateX(0)' : 'translateX(100%)',
            boxShadow: '0 0 0 2px var(--color-amber)',
          }}
        />

        {/* Home / Мэдээлэл хайх */}
        <button
          onClick={() => onNavigate('home')}
          className="relative z-10 w-1/2 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none"
          style={{
            color: currentPage === 'home' ? 'var(--color-navy)' : 'var(--color-steel)',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 'home')
              (e.currentTarget as HTMLElement).style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 'home')
              (e.currentTarget as HTMLElement).style.color = 'var(--color-steel)'
          }}
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Мэдээлэл хайх</span>
        </button>

        {/* Ads / Зар хайх */}
        <button
          onClick={() => onNavigate('ads')}
          className="relative z-10 w-1/2 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none"
          style={{
            color: currentPage === 'ads' ? 'var(--color-navy)' : 'var(--color-steel)',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 'ads')
              (e.currentTarget as HTMLElement).style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 'ads')
              (e.currentTarget as HTMLElement).style.color = 'var(--color-steel)'
          }}
        >
          <Tag className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Зар хайх</span>
        </button>
      </div>
    </nav>
  )
}

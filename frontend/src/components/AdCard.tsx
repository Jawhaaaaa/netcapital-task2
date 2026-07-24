import type { CarAd } from '../types'

interface Props {
  ad: CarAd
}

export default function AdCard({ ad }: Props) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div>
        <h3
          className="text-base font-bold mb-2"
          style={{ color: 'var(--color-ink)', fontFamily: "'Montserrat', sans-serif" }}
        >
          {ad.make} {ad.model}
        </h3>
        <span
          className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-3"
          style={{ color: 'var(--color-steel)', backgroundColor: 'rgba(148,163,184,0.15)' }}
        >
          {ad.year} он
        </span>
      </div>
      <div className="flex items-end justify-between mt-3">
        <span
          className="text-lg font-bold"
          style={{ color: 'var(--color-navy)' }}
        >
          {ad.price}
        </span>
        <button
          onClick={() => window.open(ad.link, '_blank', 'noopener,noreferrer')}
          className="text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
          style={{
            backgroundColor: 'var(--color-navy)',
            color: '#fff',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-blue)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-navy)')}
        >
          Дэлгэрэнгүй үзэх
        </button>
      </div>
    </div>
  )
}

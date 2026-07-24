import { Car } from 'lucide-react'
import type { Vehicle } from '../types'

interface Props {
  vehicle: Vehicle
}

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div>
      <p className="text-gray-400 text-xs mb-0.5">{label}</p>
      <p className="text-gray-900 font-semibold text-sm">
        {value ?? '-'}
      </p>
    </div>
  )
}

export default function VehicleResultCard({ vehicle }: Props) {
  const generalLeft = [
    { label: 'Арлын дугаар', value: vehicle.vin },
    { label: 'Загвар', value: vehicle.model },
    { label: 'Зориулалт', value: vehicle.purpose },
    { label: 'Үйлдвэрлэсэн он', value: vehicle.manufacture_year },
    { label: 'Импортолгосон', value: vehicle.imported_date },
  ]

  const generalRight = [
    { label: 'Марк', value: vehicle.make },
    { label: 'Төрөл', value: '-' },
    { label: 'Уйлдвэрлэсэн улс', value: vehicle.country },
    { label: 'Өнгө', value: vehicle.color },
    { label: 'Тусгай зориулалт', value: vehicle.special_purpose },
  ]

  const techLeft = [
    { label: 'Жолооны ангилал', value: vehicle.steering_class },
    { label: 'Суудлын тоо', value: vehicle.seat_count },
    { label: 'Хөтлөгчийн төрөл', value: vehicle.drive_type },
    { label: 'Өндөр', value: vehicle.height ?? null },
    { label: 'Өөрийн жин', value: vehicle.weight ?? null },
    { label: 'Бух жин', value: vehicle.gross_weight ?? null },
    { label: 'Даац', value: vehicle.payload ?? null },
  ]

  const techRight = [
    { label: 'Шатахууны хувилбар', value: vehicle.fuel_type },
    { label: 'Хөдөлгүүрийн багтаамж', value: vehicle.engine_capacity },
    { label: 'Хурдний байрлал', value: vehicle.steering_position },
    { label: 'Өргөн', value: vehicle.width ?? null },
    { label: 'Урт', value: vehicle.length ?? null },
    { label: 'Хөдөлгүүрийн төрөл', value: vehicle.engine_type },
    { label: 'Тэнхлэгийн тоо', value: vehicle.axle_count },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex gap-6">
      {/* Left sidebar */}
      <div className="flex flex-col items-center gap-2 min-w-25">
        <Car className="w-20 h-20 text-gray-400" />
        <p className="font-bold text-gray-900 text-base text-center">{vehicle.make ?? '-'}</p>
        <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 text-xs w-full">
          <div className="flex items-center gap-1 px-2 py-1 flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-gray-500 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <circle cx="10" cy="10" r="8" />
            </svg>
            <span className="font-bold text-gray-900">{vehicle.plate_number}</span>
          </div>
          <span className="bg-gray-200 text-gray-600 font-semibold px-2 py-1 rounded-r-lg shrink-0">
            MGL
          </span>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Ерөнхий мэдээлэл */}
          <div className="flex-1">
          <h3 className="text-blue-700 font-bold text-sm mb-3">Ерөнхий мэдээлэл</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <div className="space-y-3">
              {generalLeft.map((f) => (
                <Field key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
            <div className="space-y-3">
              {generalRight.map((f) => (
                <Field key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
          </div>
        </div>

        {/* Техникийн мэдээлэл */}
        <div className="flex-1">
          <h3 className="text-blue-700 font-bold text-sm mb-3">Техникийн мэдээлэл</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <div className="space-y-3">
              {techLeft.map((f) => (
                <Field key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
            <div className="space-y-3">
              {techRight.map((f) => (
                <Field key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

// src/components/FilterBar.js
import React from 'react'
import { Range, getTrackBackground } from 'react-range'

/**
 * FilterBar Component
 * Props:
 * - filters: { location, type, status, priceMin, priceMax, bedrooms, bathrooms, parking, sqftMin, sqftMax, lotMin, lotMax }
 * - onFilterChange: (newFilters) => void
 * - options: { locations: string[], types: string[], statuses: string[], bedrooms: number[], bathrooms: number[], parking: number[] }
 * - minPrice, maxPrice, minSqft, maxSqft, minLot, maxLot: number
 */
export default function FilterBar({
  filters,
  onFilterChange,
  options,
  minPrice,
  maxPrice,
  minSqft,
  maxSqft,
  minLot,
  maxLot
}) {
  // asignamos rangos dinámicos
  const MIN = minPrice
  const MAX = maxPrice

  // valores a mostrar en slider
  const sliderValues = [
    filters.priceMin !== '' ? filters.priceMin : MIN,
    filters.priceMax !== '' ? filters.priceMax : MAX
  ]

  const onPriceChange = ([newMin, newMax]) => {
    onFilterChange({
      ...filters,
      priceMin: newMin === MIN ? '' : newMin,
      priceMax: newMax === MAX ? '' : newMax
    })
  }

  const handleSelect = key => e =>
    onFilterChange({ ...filters, [key]: e.target.value })

  const handleNum = key => e => {
    const v = e.target.value
    onFilterChange({ ...filters, [key]: v === '' ? '' : Number(v) })
  }

  // helpers para formato
  const displayMinPrice = sliderValues[0]
  const displayMaxPrice = sliderValues[1]

  return (
    <div className="filter-bar">
      {/* Ubicación */}
      <select value={filters.location} onChange={handleSelect('location')}>
        <option value="">Ubicación</option>
        {options.locations.map(l => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      {/* Tipología */}
      <select value={filters.type} onChange={handleSelect('type')}>
        <option value="">Tipología</option>
        {options.types.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Estatus */}
      <select value={filters.status} onChange={handleSelect('status')}>
        <option value="">Estatus</option>
        {options.statuses.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Slider dual */}
      <div className="price-wrapper">
        <label className="price-label">
          Precio:&nbsp;
          <strong>${displayMinPrice.toLocaleString()}</strong>&nbsp;–&nbsp;
          <strong>${displayMaxPrice.toLocaleString()}</strong>
        </label>
        <Range
          step={1000}
          min={MIN}
          max={MAX}
          values={sliderValues}
          onChange={onPriceChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '6px',
                width: '100%',
                background: getTrackBackground({
                  values: sliderValues,
                  colors: ['#ddd', '#2a9d8f', '#ddd'],
                  min: MIN,
                  max: MAX
                }),
                borderRadius: '4px',
                margin: '0.5rem 0'
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ index, props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '16px',
                width: '16px',
                borderRadius: '50%',
                background: '#2a9d8f',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div style={{ position: 'absolute', top: '-24px', fontSize: '0.75rem' }}>
                {index === 0
                  ? `$${displayMinPrice.toLocaleString()}`
                  : `$${displayMaxPrice.toLocaleString()}`}
              </div>
            </div>
          )}
        />
      </div>

      {/* Recámaras */}
      <select value={filters.bedrooms} onChange={handleNum('bedrooms')}>
        <option value="">Recámaras</option>
        {options.bedrooms.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {/* Baños */}
      <select value={filters.bathrooms} onChange={handleNum('bathrooms')}>
        <option value="">Baños</option>
        {options.bathrooms.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {/* Estacionamientos */}
      <select value={filters.parking} onChange={handleNum('parking')}>
        <option value="">Estac.</option>
        {options.parking.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {/* Área construcción */}
      <input
        type="number"
        placeholder={`Min sqft (${minSqft})`}
        value={filters.sqftMin}
        onChange={handleNum('sqftMin')}
      />
      <input
        type="number"
        placeholder={`Max sqft (${maxSqft})`}
        value={filters.sqftMax}
        onChange={handleNum('sqftMax')}
      />

      {/* Área lote */}
      <input
        type="number"
        placeholder={`Min lote (${minLot})`}
        value={filters.lotMin}
        onChange={handleNum('lotMin')}
      />
      <input
        type="number"
        placeholder={`Max lote (${maxLot})`}
        value={filters.lotMax}
        onChange={handleNum('lotMax')}
      />

      <button onClick={() => onFilterChange(filters)}>Buscar</button>

      <style jsx>{`
        .filter-bar {
          position: sticky;
          top: 0;
          background: #fff;
          padding: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          border-bottom: 1px solid #eee;
          z-index: 10;
        }
        select, input[type="number"], button {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        .price-wrapper {
          flex: 1 1 100%;
        }
        .price-label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }
        button {
          background: #2a9d8f;
          color: #fff;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

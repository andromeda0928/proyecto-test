// src/components/FilterBar.js
import React from 'react'
import { Range, getTrackBackground } from 'react-range'

/**
 * FilterBar Component
 * Props:
 * - filters: {
 *     location, type, status,
 *     priceMin, priceMax,
 *     bedrooms, bathrooms, parking,
 *     sqftMin, sqftMax, lotMin, lotMax
 *   }
 * - onFilterChange: (newFilters) => void
 * - options: {
 *     locations: string[],
 *     types: string[],
 *     statuses: string[],
 *     bedrooms: number[],
 *     bathrooms: number[],
 *     parking: number[]
 *   }
 */
export default function FilterBar({ filters, onFilterChange, options }) {
  const MIN = 1000
  const MAX = 1000000

  // Cuando cambian ambos valores del slider
  const onPriceChange = ([newMin, newMax]) => {
    onFilterChange({ ...filters, priceMin: newMin, priceMax: newMax })
  }

  const handleSelect = key => e =>
    onFilterChange({ ...filters, [key]: e.target.value })

  const handleNum = key => e => {
    const v = e.target.value
    onFilterChange({ ...filters, [key]: v === '' ? '' : Number(v) })
  }

  return (
    <div className="filter-bar">
      {/* ubicación / tipología / venta-renta */}
      <select value={filters.location} onChange={handleSelect('location')}>
        <option value="">Ubicación</option>
        {options.locations.map(l => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
      <select value={filters.type} onChange={handleSelect('type')}>
        <option value="">Tipología</option>
        {options.types.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select value={filters.status} onChange={handleSelect('status')}>
        <option value="">Venta / Alquiler</option>
        {options.statuses.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* slider dual con react-range */}
      <div className="price-wrapper">
        <label className="price-label">
          Precio:&nbsp;
          <strong>${filters.priceMin.toLocaleString()}</strong>&nbsp;–&nbsp;
          <strong>${filters.priceMax.toLocaleString()}</strong>
        </label>
        <Range
          step={1000}
          min={MIN}
          max={MAX}
          values={[filters.priceMin, filters.priceMax]}
          onChange={onPriceChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '6px',
                width: '100%',
                background: getTrackBackground({
                  values: [filters.priceMin, filters.priceMax],
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
                  ? `$${filters.priceMin.toLocaleString()}`
                  : `$${filters.priceMax.toLocaleString()}`}
              </div>
            </div>
          )}
        />
      </div>

      {/* recámaras / baños / estacionamientos */}
      <select value={filters.bedrooms} onChange={handleNum('bedrooms')}>
        <option value="">Recámaras</option>
        {options.bedrooms.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <select value={filters.bathrooms} onChange={handleNum('bathrooms')}>
        <option value="">Baños</option>
        {options.bathrooms.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <select value={filters.parking} onChange={handleNum('parking')}>
        <option value="">Estac.</option>
        {options.parking.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {/* áreas */}
      <input
        type="number"
        placeholder="Min sqft"
        value={filters.sqftMin}
        onChange={handleNum('sqftMin')}
      />
      <input
        type="number"
        placeholder="Max sqft"
        value={filters.sqftMax}
        onChange={handleNum('sqftMax')}
      />
      <input
        type="number"
        placeholder="Min lote"
        value={filters.lotMin}
        onChange={handleNum('lotMin')}
      />
      <input
        type="number"
        placeholder="Max lote"
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

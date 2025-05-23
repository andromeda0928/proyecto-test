// File: src/components/FilterBar/FilterBar.jsx

import { Range, getTrackBackground } from 'react-range'
import styles from './FilterBar.module.css'
import { useFilters } from '@/hooks/useFilters'

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
  // Extraemos toda la lógica de filtros a nuestro hook
  const {
    sliderValues,
    onPriceChange,
    handleSelect,
    handleNum,
    displayMin,
    displayMax
  } = useFilters({ filters, onFilterChange, minPrice, maxPrice })

  return (
    <div className={styles.filterBar}>

      <select
        className={styles.control}
        value={filters.location}
        onChange={handleSelect('location')}
      >
        <option value="">Ubicación</option>
        {options.locations.map(l => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <select
        className={styles.control}
        value={filters.type}
        onChange={handleSelect('type')}
      >
        <option value="">Tipología</option>
        {options.types.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        className={styles.control}
        value={filters.status}
        onChange={handleSelect('status')}
      >
        <option value="">Estatus</option>
        {options.statuses.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className={styles.priceWrapper}>
        <label className={styles.priceLabel}>
          Precio:&nbsp;
          <strong>${displayMin.toLocaleString()}</strong>&nbsp;–&nbsp;
          <strong>${displayMax.toLocaleString()}</strong>
        </label>
        <Range
          step={1000}
          min={minPrice}
          max={maxPrice}
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
                  min: minPrice,
                  max: maxPrice,
                }),
                borderRadius: '4px',
                margin: '0.5rem 0',
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
                alignItems: 'center',
              }}
            >
              <div style={{ position: 'absolute', top: '-24px', fontSize: '0.75rem' }}>
                {index === 0
                  ? `$${displayMin.toLocaleString()}`
                  : `$${displayMax.toLocaleString()}`}
              </div>
            </div>
          )}
        />
      </div>

      <select
        className={styles.control}
        value={filters.bedrooms}
        onChange={handleNum('bedrooms')}
      >
        <option value="">Recámaras</option>
        {options.bedrooms.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <select
        className={styles.control}
        value={filters.bathrooms}
        onChange={handleNum('bathrooms')}
      >
        <option value="">Baños</option>
        {options.bathrooms.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <select
        className={styles.control}
        value={filters.parking}
        onChange={handleNum('parking')}
      >
        <option value="">Estac.</option>
        {options.parking.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <input
        className={styles.control}
        type="number"
        placeholder={`Min sqft (${minSqft})`}
        value={filters.sqftMin}
        onChange={handleNum('sqftMin')}
      />
      <input
        className={styles.control}
        type="number"
        placeholder={`Max sqft (${maxSqft})`}
        value={filters.sqftMax}
        onChange={handleNum('sqftMax')}
      />

      <input
        className={styles.control}
        type="number"
        placeholder={`Min lote (${minLot})`}
        value={filters.lotMin}
        onChange={handleNum('lotMin')}
      />
      <input
        className={styles.control}
        type="number"
        placeholder={`Max lote (${maxLot})`}
        value={filters.lotMax}
        onChange={handleNum('lotMax')}
      />

      <button
        className={styles.searchButton}
        onClick={() => onFilterChange(filters)}
      >
        Buscar
      </button>
    </div>
  )
}

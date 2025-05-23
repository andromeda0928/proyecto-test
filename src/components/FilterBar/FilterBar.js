// File: src/components/FilterBar/FilterBar.jsx
import { useState, useMemo } from 'react'
import { Range, getTrackBackground } from 'react-range'
import styles from './FilterBar.module.css'

export default function FilterBar({
  filters,
  onFilterChange,
  options,
  minPrice, maxPrice,
  minSqft, maxSqft,
  minLot, maxLot
}) {
  const [open, setOpen] = useState(false)
  const MIN = minPrice
  const MAX = maxPrice
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

  const [displayMin, displayMax] = sliderValues

  // Contenido del formulario de filtros
  const form = (
    <>
      <header className={styles.modalHeader}>
        <h2>Filtros</h2>
        <button
          className={styles.closeButton}
          onClick={() => setOpen(false)}
          aria-label="Cerrar filtros"
        >
          <span className={styles.closeIcon}>&times;</span>
        </button>
      </header>

      <div className={styles.controls}>
        {/* Ubicación, Tipología, Estatus */}
        <select className={styles.control} value={filters.location} onChange={handleSelect('location')}>
          <option value="">Ubicación</option>
          {options.locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className={styles.control} value={filters.type} onChange={handleSelect('type')}>
          <option value="">Tipología</option>
          {options.types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className={styles.control} value={filters.status} onChange={handleSelect('status')}>
          <option value="">Estatus</option>
          {options.statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Slider de precio */}
        <div className={styles.priceWrapper}>
          <label className={styles.priceLabel}>
            Precio: <strong>${displayMin.toLocaleString()}</strong> – <strong>${displayMax.toLocaleString()}</strong>
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
                    colors: ['#ddd', 'var(--color-primary)', '#ddd'],
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
                  background: 'var(--color-primary)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
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

        {/* Demás controles */}
        <select className={styles.control} value={filters.bedrooms} onChange={handleNum('bedrooms')}>
          <option value="">Recámaras</option>
          {options.bedrooms.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select className={styles.control} value={filters.bathrooms} onChange={handleNum('bathrooms')}>
          <option value="">Baños</option>
          {options.bathrooms.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select className={styles.control} value={filters.parking} onChange={handleNum('parking')}>
          <option value="">Estac.</option>
          {options.parking.map(n => <option key={n} value={n}>{n}</option>)}
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
      </div>

      <button
        className={styles.applyButton}
        onClick={() => {
          onFilterChange(filters)
          setOpen(false)
        }}
      >
        Aplicar
      </button>
    </>
  )

  return (
    <>
      {/* Botón que abre el modal */}
      <button className={styles.filterToggle} onClick={() => setOpen(true)}>
        FILTROS <span className={styles.arrow}>▼</span>
      </button>

      {/* Modal: clic en overlay cierra */}
      {open && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            {form}
          </div>
        </div>
      )}
    </>
  )
}

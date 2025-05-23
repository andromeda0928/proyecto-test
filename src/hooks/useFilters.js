// src/hooks/useFilters.js
import { useMemo } from 'react'

/**
 * Maneja el estado y los handlers de los filtros:
 * - priceMin / priceMax ↔ Range
 * - select inputs
 * - number inputs
 *
 * @param {Object} params
 * @param {Object} params.filters         Estado actual de los filtros
 * @param {Function} params.onFilterChange Callback para actualizar filtros
 * @param {number} params.minPrice        Límite mínimo para el slider de precio
 * @param {number} params.maxPrice        Límite máximo para el slider de precio
 * @returns {Object} Valores y handlers listos para usar en la UI
 */
export function useFilters({ filters, onFilterChange, minPrice, maxPrice }) {
  const MIN = minPrice
  const MAX = maxPrice

  // Valores al pintar el slider
  const sliderValues = useMemo(() => [
    filters.priceMin !== '' ? filters.priceMin : MIN,
    filters.priceMax !== '' ? filters.priceMax : MAX
  ], [filters.priceMin, filters.priceMax, MIN, MAX])

  // Handler dual del slider
  const onPriceChange = ([newMin, newMax]) => {
    onFilterChange({
      ...filters,
      priceMin:  newMin === MIN ? '' : newMin,
      priceMax:  newMax === MAX ? '' : newMax,
    })
  }

  // Select genérico
  const handleSelect = key => e =>
    onFilterChange({ ...filters, [key]: e.target.value })

  // Number input genérico
  const handleNum = key => e => {
    const v = e.target.value
    onFilterChange({ ...filters, [key]: v === '' ? '' : Number(v) })
  }

  // Para mostrar etiquetas del slider
  const [displayMin, displayMax] = sliderValues

  return {
    sliderValues,
    onPriceChange,
    handleSelect,
    handleNum,
    displayMin,
    displayMax,
  }
}

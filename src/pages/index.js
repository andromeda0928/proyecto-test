// File: src/pages/index.js

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'

import FilterBar from '@/components/FilterBar/FilterBar'
import Card from '@/components/Card/Card'
import Pagination from '@/components/Pagination/Pagination'

const PAGE_SIZE = 40

export async function getStaticProps() {
  const API_KEY    = process.env.AIRTABLE_API_KEY
  const BASE_ID    = process.env.AIRTABLE_BASE_ID
  const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME
  const API_URL    = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`

  let allRecords = []
  let offset

  // Trae todos los registros de 100 en 100
  do {
    const params = new URLSearchParams({ pageSize: '100' })
    if (offset) params.set('offset', offset)

    const res = await fetch(`${API_URL}?${params}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) break

    const { records, offset: nextOffset } = await res.json()
    allRecords.push(...records)
    offset = nextOffset
  } while (offset)

  const properties = allRecords.map(r => {
    const f = r.fields || {}
    const titles = typeof f.title === 'string'
      ? f.title.split(',').map(s => s.trim())
      : []

    return {
      id:             r.id,
      street_name:    f.street_name   || '—',
      map_area:       f.map_area      || '—',
      property_type:  f.property_type || '—',
      titles,
      price_current:  f.price_current || 0,
      bedrooms:       f.bedrooms      || 0,
      bathrooms:      f.bathrooms     || 0,
      parking_spaces: f.parking_spaces|| 0,
      sqft_total:     f.sqft_total    || 0,
      lot_sqft:       f.lot_sqft      || 0,
      urlImgs: Array.isArray(f.url_img)
        ? f.url_img
        : typeof f.url_img === 'string'
          ? f.url_img.split(',').map(s => s.trim())
          : [],
    }
  })

  return {
    props:      { properties },
    revalidate: 60,
  }
}

export default function Catalog({ properties }) {
  const router = useRouter()
  const { page = '1' } = router.query
  const pageNum = Math.max(1, parseInt(page, 10) || 1)

  // Opciones para filtros
  const types     = useMemo(() => [...new Set(properties.map(p => p.property_type))], [properties])
  const locations = useMemo(() => [...new Set(properties.map(p => p.map_area))], [properties])
  const statuses  = useMemo(() => [...new Set(properties.flatMap(p => p.titles))], [properties])
  const bedrooms  = [1,2,3,4,5]
  const bathrooms = [1,2,3,4,5]
  const parking   = [0,1,2,3,4,5]

  // Límites para sliders
  const priceList = properties.map(p => p.price_current)
  const minPrice  = Math.min(...priceList)
  const maxPrice  = Math.max(...priceList)
  const sqftList  = properties.map(p => p.sqft_total)
  const minSqft   = Math.min(...sqftList)
  const maxSqft   = Math.max(...sqftList)
  const lotList   = properties.map(p => p.lot_sqft)
  const minLot    = Math.min(...lotList)
  const maxLot    = Math.max(...lotList)

  // Estado de filtros
  const [filters, setFilters] = useState({
    location: '', type: '', status: '',
    priceMin: '', priceMax: '',
    bedrooms: '', bathrooms: '', parking: '',
    sqftMin: '', sqftMax: '',
    lotMin: '', lotMax: '',
  })

  // Filtrado
  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (filters.location && p.map_area !== filters.location) return false
      if (filters.type     && p.property_type !== filters.type) return false
      if (filters.status   && !p.titles.includes(filters.status)) return false

      const minP = filters.priceMin !== '' ? filters.priceMin : minPrice
      const maxP = filters.priceMax !== '' ? filters.priceMax : maxPrice
      if (p.price_current < minP || p.price_current > maxP) return false

      if (filters.bedrooms && p.bedrooms !== filters.bedrooms) return false
      if (filters.bathrooms&& p.bathrooms !== filters.bathrooms) return false
      if (filters.parking  && p.parking_spaces !== filters.parking) return false

      const minS = filters.sqftMin !== '' ? filters.sqftMin : minSqft
      const maxS = filters.sqftMax !== '' ? filters.sqftMax : maxSqft
      if (p.sqft_total < minS || p.sqft_total > maxS) return false

      const minL = filters.lotMin !== '' ? filters.lotMin : minLot
      const maxL = filters.lotMax !== '' ? filters.lotMax : maxLot
      if (p.lot_sqft < minL || p.lot_sqft > maxL) return false

      return true
    })
  }, [properties, filters, minPrice, maxPrice, minSqft, maxSqft, minLot, maxLot])

  // Paginación
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const start      = (pageNum - 1) * PAGE_SIZE
  const paged      = filtered.slice(start, start + PAGE_SIZE)

  // Construye páginas compactas
  const delta = 2
  const pagesArray = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= pageNum - delta && i <= pageNum + delta)) {
      pagesArray.push(i)
    } else if (pagesArray[pagesArray.length - 1] !== '...') {
      pagesArray.push('...')
    }
  }

  const handlePageChange = p => {
    if (p < 1 || p > totalPages) return
    router.push(`/?page=${p}`, undefined, { shallow: true })
  }

  return (
    <>
      <Head>
        <title>{`Catálogo de Propiedades – Página ${pageNum}`}</title>
        <meta name="description" content={`Página ${pageNum} de tu catálogo`} />
      </Head>

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        options={{ locations, types, statuses, bedrooms, bathrooms, parking }}
        minPrice={minPrice}
        maxPrice={maxPrice}
        minSqft={minSqft}
        maxSqft={maxSqft}
        minLot={minLot}
        maxLot={maxLot}
      />

      <main>
        <ul className="grid">
          {paged.map(p => (
            <Card key={p.id} property={p} />
          ))}
        </ul>

        <Pagination
          pageNum={pageNum}
          totalPages={totalPages}
          pagesArray={pagesArray}
          onPageChange={handlePageChange}
        />
      </main>

      <style jsx>{`
        main {
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }
      `}</style>
    </>
  )
}

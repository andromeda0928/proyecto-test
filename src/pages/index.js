// src/pages/index.js
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import FilterBar from '@/components/FilterBar'

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
    return {
      id:            r.id,
      street_name:   f.street_name || '—',
      map_area:      f.map_area    || '—',
      property_type: f.property_type || '—',
      status:        f.status      || '',
      price_current: f.price_current || 0,
      bedrooms:      f.bedrooms    || 0,
      bathrooms:     f.bathrooms   || 0,
      parking_spaces:f.parking_spaces || 0,
      sqft_total:    f.sqft_total  || 0,
      lot_sqft:      f.lot_sqft    || 0,
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
  const pageNum    = Math.max(1, parseInt(page, 10) || 1)

  // ——— OPCIONES ———
  const types     = useMemo(() => [...new Set(properties.map(p => p.property_type))], [properties])
  const locations = useMemo(() => [...new Set(properties.map(p => p.map_area))], [properties])
  const statuses  = useMemo(() => [...new Set(properties.map(p => p.status))], [properties])
  const bedrooms  = [1,2,3,4,5]
  const bathrooms = [1,2,3,4,5]
  const parking   = [0,1,2,3,4,5]

  // ——— BOUNDS PARA SLIDERS ———
  const priceList = properties.map(p => p.price_current)
  const minPrice  = Math.min(...priceList)
  const maxPrice  = Math.max(...priceList)
  const sqftList  = properties.map(p => p.sqft_total)
  const minSqft   = Math.min(...sqftList)
  const maxSqft   = Math.max(...sqftList)
  const lotList   = properties.map(p => p.lot_sqft)
  const minLot    = Math.min(...lotList)
  const maxLot    = Math.max(...lotList)

  // ——— ESTADO DE FILTROS ———
  const [filters, setFilters] = useState({
    location:   '',  // antes era min/max
    type:       '',
    status:     '',
    priceMin:   1000,  // empezar vacío
    priceMax:   1000000,
    bedrooms:   '',
    bathrooms:  '',
    parking:    '',
    sqftMin:    '',
    sqftMax:    '',
    lotMin:     '',
    lotMax:     '',
  })


  // ——— FILTRADO ———
  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (filters.location && p.map_area !== filters.location) return false
      if (filters.type     && p.property_type !== filters.type) return false
      if (filters.status   && p.status !== filters.status) return false

      // precios
      if (filters.priceMin !== '' && p.price_current < filters.priceMin) return false
      if (filters.priceMax !== '' && p.price_current > filters.priceMax) return false

      // números exactos
      if (filters.bedrooms  !== '' && p.bedrooms     !== filters.bedrooms) return false
      if (filters.bathrooms !== '' && p.bathrooms    !== filters.bathrooms) return false
      if (filters.parking   !== '' && p.parking_spaces!== filters.parking) return false

      // rangos de área
      if (filters.sqftMin   !== '' && p.sqft_total < filters.sqftMin) return false
      if (filters.sqftMax   !== '' && p.sqft_total > filters.sqftMax) return false
      if (filters.lotMin    !== '' && p.lot_sqft   < filters.lotMin) return false
      if (filters.lotMax    !== '' && p.lot_sqft   > filters.lotMax) return false

      return true
    })
  }, [properties, filters])


  // ——— PAGINACIÓN ———
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const start      = (pageNum - 1) * PAGE_SIZE
  const paged      = filtered.slice(start, start + PAGE_SIZE)
  const goTo       = p => {
    if (p < 1 || p > totalPages) return
    router.push(`/?page=${p}`, undefined, { shallow: true })
  }

  // ——— PÁGINAS COMPACTAS ———
  const delta = 2
  const pagesArray = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= pageNum - delta && i <= pageNum + delta)
    ) {
      pagesArray.push(i)
    } else if (pagesArray[pagesArray.length - 1] !== '...') {
      pagesArray.push('...')
    }
  }

  return (
    <>
      <Head>
        <title>{`Catálogo de Propiedades – Página ${pageNum}`}</title>
        <meta name="description" content={`Página ${pageNum} de tu catálogo`} />
      </Head>

      {/* barra de filtros fija */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        options={{
          locations,
          types,
          statuses,
          bedrooms,
          bathrooms,
          parking
        }}
        bounds={{
          priceMin: minPrice, priceMax: maxPrice,
          sqftMin:  minSqft,  sqftMax:  maxSqft,
          lotMin:   minLot,   lotMax:   maxLot
        }}
      />

      <main>
        <ul className="grid">
          {paged.map(p => {
            const thumb = p.urlImgs[0]
              ? `https://panama-green.com/wp-content/uploads/wpallimport/files/${p.urlImgs[0]}`
              : null
            return (
              <li key={p.id}>
                <a href={`/${p.id}`} className="card">
                  {thumb
                    ? <img src={thumb} alt={p.street_name} className="thumb" />
                    : <div className="thumb-placeholder">Sin imagen</div>
                  }
                  <div className="card-body">
                    <h2>{p.street_name}</h2>
                    <p className="location">{p.map_area}</p>
                    <p className="type">{p.property_type}</p>
                    <p className="price">${p.price_current.toLocaleString()}</p>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>

        <nav className="pagination">
          <button
            onClick={() => goTo(pageNum - 1)}
            disabled={pageNum === 1}
            className="page-btn"
          >‹</button>

          {pagesArray.map((p, idx) =>
            p === '...'
              ? <span key={idx} className="dots">…</span>
              : <button
                  key={idx}
                  onClick={() => goTo(p)}
                  className={`page-btn${p === pageNum ? ' active' : ''}`}
                >{p}</button>
          )}

          <button
            onClick={() => goTo(pageNum + 1)}
            disabled={pageNum === totalPages}
            className="page-btn"
          >›</button>
        </nav>
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
        .card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform .2s;
        }
        .card:hover { transform: translateY(-4px); }
        .thumb {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }
        .thumb-placeholder {
          width:100%; height:160px;
          background:#eee;
          display:flex; align-items:center; justify-content:center;
          color:#999;
        }
        .card-body {
          padding:1rem;
          display:flex; flex-direction:column; flex:1;
        }
        .location, .type {
          margin:0 0 .5rem;
          color:#666; font-size:.9rem;
        }
        .price {
          margin-top:auto;
          font-weight:bold; color:#2a9d8f;
        }

        .pagination {
          display:flex;
          justify-content:center;
          align-items:center;
          flex-wrap:wrap;
          gap:.5rem;
          margin:2rem 0;
        }
        .page-btn {
          background:white;
          border:1px solid #ccc;
          padding:.5rem .75rem;
          border-radius:4px;
          cursor:pointer;
        }
        .page-btn:disabled {
          opacity:.5;
          cursor:default;
        }
        .page-btn.active {
          background:#2a9d8f;
          color:white;
          border-color:#2a9d8f;
        }
        .dots {
          padding:.5rem .75rem;
          color:#666;
          pointer-events:none;
        }
      `}</style>
    </>
  )
}

// pages/index.js
import Head from 'next/head'
import { useRouter } from 'next/router'

const PAGE_SIZE = 25

export async function getStaticProps() {
  const API_KEY    = process.env.AIRTABLE_API_KEY
  const BASE_ID    = process.env.AIRTABLE_BASE_ID
  const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME
  const API_URL    = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`

  const res = await fetch(`${API_URL}?pageSize=100`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type':  'application/json',
    },
  })

  if (!res.ok) {
    console.error('Airtable error', res.status, res.statusText)
    return { props: { properties: [] }, revalidate: 60 }
  }

  const { records } = await res.json()
  const properties = records.map(r => {
    const f = r.fields || {}
    return {
      id:            r.id,
      street_name:   f.street_name   || '—',
      map_area:      f.map_area      || '—',
      property_type: f.property_type || '—',
      price_current: f.price_current || 0,
      urlImgs: Array.isArray(f.url_img)
        ? f.url_img
        : typeof f.url_img === 'string'
          ? f.url_img.split(',').map(s => s.trim())
          : [],
    }
  })

  return { props: { properties }, revalidate: 60 }
}

export default function Catalog({ properties }) {
  const router = useRouter()
  const { page = '1' } = router.query
  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const totalPages = Math.ceil(properties.length / PAGE_SIZE)
  const start = (pageNum - 1) * PAGE_SIZE
  const paged = properties.slice(start, start + PAGE_SIZE)

  const goTo = (p) => {
    router.push(`/?page=${p}`, undefined, { shallow: true })
  }

  return (
    <>
      <Head>
        <title>Catálogo de Propiedades – Página {pageNum}</title>
        <meta name="description" content={`Página ${pageNum} de tu catálogo`} />
      </Head>

      <main>
        <h1>Catálogo de Propiedades</h1>
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
          {/* Botón Anterior */}
          <button
            onClick={() => goTo(pageNum - 1)}
            disabled={pageNum === 1}
            className="page-btn"
          >
            ‹
          </button>

          {/* Números de página */}
          {Array.from({ length: totalPages }, (_, i) => {
            const num = i + 1
            return (
              <button
                key={num}
                onClick={() => goTo(num)}
                className={`page-btn${num === pageNum ? ' active' : ''}`}
              >
                {num}
              </button>
            )
          })}

          {/* Botón Siguiente */}
          <button
            onClick={() => goTo(pageNum + 1)}
            disabled={pageNum === totalPages}
            className="page-btn"
          >
            ›
          </button>
        </nav>
      </main>

      <style jsx>{`
        main {
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          text-align: center;
          margin-bottom: 1.5rem;
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
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-4px);
        }
        .thumb {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }
        .thumb-placeholder {
          width: 100%;
          height: 160px;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
        }
        .card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .location,
        .type {
          margin: 0 0 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }
        .price {
          margin-top: auto;
          font-weight: bold;
          color: #2a9d8f;
        }
        .pagination {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 2rem 0;
        }
        .pagination a {
          padding: 0.5rem 1rem;
          background: #2a9d8f;
          color: #fff;
          border-radius: 4px;
          text-decoration: none;
        }
      `}</style>
    </>
  )
}

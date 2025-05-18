// pages/page/[pageIndex].js
import Head from 'next/head'

const PAGE_SIZE = 25

export async function getStaticPaths() {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env
  const API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`

  // Sólo necesitamos contar registros para calcular cuántas páginas hay
  const res = await fetch(`${API_URL}?pageSize=100`, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
  })
  const { records } = await res.json()
  const totalPages = Math.ceil(records.length / PAGE_SIZE)

  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { pageIndex: String(i + 1) }
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env
  const API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`

  const res = await fetch(`${API_URL}?pageSize=100`, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
  })
  const { records } = await res.json()

  const all = records.map((r) => {
    const f = r.fields || {}
    return {
      id: r.id,
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

  const page = parseInt(params.pageIndex, 10)
  const totalPages = Math.ceil(all.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const properties = all.slice(start, start + PAGE_SIZE)

  return {
    props: { properties, page, totalPages },
    revalidate: 60,
  }
}

export default function CatalogPage({ properties, page, totalPages }) {
  return (
    <>
      <Head>
        <title>Catálogo – Página {page}</title>
      </Head>

      <main>
        <h1>Catálogo de Propiedades (Página {page}/{totalPages})</h1>
        <ul className="grid">
          {properties.map((p) => {
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
          {page > 1 && (
            <a href={page === 2 ? `/` : `/page/${page - 1}`} className="prev">‹ Anterior</a>
          )}
          {page < totalPages && (
            <a href={`/page/${page + 1}`} className="next">Siguiente ›</a>
          )}
        </nav>
      </main>

      <style jsx>{`
        /* tu CSS existente */
        .pagination {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin: 2rem 0;
        }
        .pagination a {
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          text-decoration: none;
          color: #2a9d8f;
          border: 1px solid #ddd;
        }
        .pagination .prev,
        .pagination .next { font-weight: bold; }
      `}</style>
    </>
  )
}

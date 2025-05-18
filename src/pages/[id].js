// pages/[id].js
import Head from 'next/head'
import { useRouter } from 'next/router'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function getStaticPaths() {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env
  const apiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME
  )}`

  const res = await fetch(`${apiUrl}?pageSize=100`, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
  })
  if (!res.ok) {
    console.error('Airtable getStaticPaths error', res.status, res.statusText)
    return { paths: [], fallback: 'blocking' }
  }

  const { records } = await res.json()
  const paths = records.map((r) => ({ params: { id: r.id } }))

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env
  const apiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME
  )}`

  const res = await fetch(`${apiUrl}/${params.id}`, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
  })
  if (!res.ok) {
    console.warn('Airtable record not found', params.id)
    return { notFound: true }
  }

  const record = await res.json()
  return {
    props: { record },
    revalidate: 60,
  }
}

export default function Detail({ record }) {
  const router = useRouter()
  const f = record.fields || {}

  // Construye URLs de las imágenes
  const baseImg =
    'https://panama-green.com/wp-content/uploads/wpallimport/files'
  const filenames =
    typeof f.url_img === 'string'
      ? f.url_img.split(',').map((s) => s.trim())
      : Array.isArray(f.url_img)
      ? f.url_img
      : []
  const imageUrls = filenames.map((name) => `${baseImg}/${name}`)

  // Primera imagen para Open Graph
  const ogImage = imageUrls[0] || `${SITE_URL}/placeholder.png`

  // Link de compartir por WhatsApp
  const shareText = encodeURIComponent(
    `${f.street_name || 'Propiedad'} – $${(
      f.price_current || 0
    ).toLocaleString()}\n${SITE_URL}/${record.id}`
  )
  const waHref = `https://api.whatsapp.com/send?text=${shareText}`

  return (
    <>
      <Head>
        <title>{f.street_name || 'Detalle de Propiedad'}</title>
        <meta name="description" content={f.remarks_es || f.remarks || ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={f.street_name || ''} />
        <meta
          property="og:description"
          content={f.remarks_es || f.remarks || ''}
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`${SITE_URL}/${record.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main>
        <button onClick={() => router.back()} className="back-link">
          ← Volver al catálogo
        </button>

        <h1>{f.street_name}</h1>

        <div className="gallery">
          {imageUrls.length > 0 ? (
            imageUrls.map((url) => (
              <img key={url} src={url} alt={f.street_name} />
            ))
          ) : (
            <p>No hay imágenes disponibles.</p>
          )}
        </div>

        <section className="info-grid">
          <div><strong>Precio:</strong> ${f.price_current?.toLocaleString() || 'N/D'}</div>
          <div><strong>Subdivisión:</strong> {f.subdivision || 'N/D'}</div>
          <div><strong>Región:</strong> {f.region || 'N/D'}</div>
          <div><strong>Distrito:</strong> {f.district || 'N/D'}</div>
          <div><strong>Área:</strong> {f.map_area || 'N/D'}</div>
          <div><strong>Tipo:</strong> {f.property_type || 'N/D'}</div>
          <div><strong>Año:</strong> {f.year_built || 'N/D'}</div>
          <div><strong>Recámaras:</strong> {f.bedrooms || 'N/D'}</div>
          <div><strong>Baños:</strong> {f.bathrooms || 'N/D'}</div>
          <div><strong>Medios baños:</strong> {f.half_bathrooms || 'N/D'}</div>
          <div><strong>Habitaciones:</strong> {f.number_of_rooms || 'N/D'}</div>
          <div><strong>Tamaño lote:</strong> {f.lot_sqft ? `${f.lot_sqft} ft²` : 'N/D'}</div>
          <div><strong>Total sqft:</strong> {f.sqft_total ? `${f.sqft_total} ft²` : 'N/D'}</div>
          <div><strong>Estilo:</strong> {f.style || 'N/D'}</div>
          <div><strong>Remodelado:</strong> {f.remodelled || 'N/D'}</div>
          <div><strong>Posesión:</strong> {f.possession || 'N/D'}</div>
          <div><strong>Zonificación:</strong> {f.zoning || 'N/D'}</div>
          <div><strong>Estado:</strong> {f.status || 'N/D'}</div>
        </section>

        <section className="features">
          <h2>Características</h2>
          {f.interior_features && (
            <p><strong>Interior:</strong> {f.interior_features}</p>
          )}
          {f.exterior_features && (
            <p><strong>Exterior:</strong> {f.exterior_features}</p>
          )}
          {Array.isArray(f.other_services) && (
            <p><strong>Servicios:</strong> {f.other_services.join(', ')}</p>
          )}
          {Array.isArray(f.internal_features) && (
            <p><strong>Otras:</strong> {f.internal_features.join(', ')}</p>
          )}
        </section>

        <section className="remarks">
          <h2>Descripción</h2>
          <p>{f.remarks_es || f.remarks || 'Sin descripción.'}</p>
        </section>

        <a href={waHref} className="btn-share" target="_blank" rel="noopener">
          Compartir por WhatsApp
        </a>
      </main>

      <style jsx>{`
        main { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        .back-link { display: inline-block; margin-bottom: 1rem; color: #2a9d8f; }
        h1 { text-align: center; margin-bottom: 1rem; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap:4px; }
        .gallery img { width:100%;height:150px;object-fit:cover;border-radius:4px; }
        .info-grid { display:grid;grid-template-columns:1fr 1fr;gap:.5rem 1rem;padding:1rem 0;border-top:1px solid #eee; }
        .features, .remarks { padding:1rem 0; border-top:1px solid #eee; }
        .btn-share { display:inline-block;margin:1rem 0 2rem;padding:.75rem 1.25rem;background:#25D366;color:#fff;border-radius:4px;text-decoration:none; }
      `}</style>
    </>
  )
}

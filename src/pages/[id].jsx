// src/pages/[id].js
import Head from 'next/head'
import PropertyDetail from '@/components/PropertyDetail/PropertyDetail'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function getStaticPaths() {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env
  const apiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`

  const res = await fetch(`${apiUrl}?pageSize=100`, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
  })
  const { records } = await res.json()
  const paths = records.map(r => ({ params: { id: r.id } }))

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env
  const apiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`

  const res = await fetch(`${apiUrl}/${params.id}`, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
  })
  if (!res.ok) return { notFound: true }

  const record = await res.json()

  // Construye aquí URLs e info de Open Graph
  const f = record.fields || {}
  const baseImg = 'https://panama-green.com/wp-content/uploads/wpallimport/files'
  const filenames = typeof f.url_img === 'string'
    ? f.url_img.split(',').map(s => s.trim())
    : Array.isArray(f.url_img)
      ? f.url_img
      : []
  const imageUrls = filenames.map(n => `${baseImg}/${n}`)
  const ogImage = imageUrls[0] || `${SITE_URL}/placeholder.png`

  return {
    props: { record, imageUrls, ogImage },
    revalidate: 60,
  }
}

export default function PropertyPage({ record, imageUrls, ogImage }) {
  const f = record.fields || {}
  const shareText = encodeURIComponent(
    `${f.street_name} – $${(f.price_current || 0).toLocaleString()}\n${SITE_URL}/${record.id}`
  )
  const waHref = `https://api.whatsapp.com/send?text=${shareText}`

  return (
    <>
      <Head>
        <title>{f.street_name || 'Detalle de Propiedad'}</title>
        <meta name="description" content={f.remarks_es || f.remarks || ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={f.street_name || ''} />
        <meta property="og:description" content={f.remarks_es || f.remarks || ''} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`${SITE_URL}/${record.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <PropertyDetail 
        record={record} 
        imageUrls={imageUrls} 
        waHref={waHref} 
      />
    </>
  )
}

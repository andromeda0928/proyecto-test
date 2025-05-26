// src/pages/[id].js
import Head from 'next/head'
import PropertyDetail from '@/components/PropertyDetail/PropertyDetail'
import { fetchAllProperties } from '@/lib/Airtable'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function getStaticPaths() {
  const tableName = process.env.AIRTABLE_TABLE_NAME
  const allProps = await fetchAllProperties(tableName)

  const paths = allProps.map(prop => ({
    params: { id: prop.id }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  const tableName = process.env.AIRTABLE_TABLE_NAME
  const allProps = await fetchAllProperties(tableName)
  const record = allProps.find(p => p.id === params.id)

  if (!record) {
    return { notFound: true }
  }

  // Construye el enlace de WhatsApp
  const shareText = encodeURIComponent(
    `${record.street_name} – $${record.price_current.toLocaleString()}\n${SITE_URL}/${record.id}`
  )
  const waHref = `https://api.whatsapp.com/send?text=${shareText}`

  // Imagen OG: la primera de record.imageUrls o fallback
  const ogImage =
    record.imageUrls.length > 0
      ? record.imageUrls[0]
      : `${SITE_URL}/placeholder.png`

  return {
    props: {
      record,
      waHref,
      ogImage
    },
    revalidate: 60
  }
}

export default function PropertyPage({ record, waHref, ogImage }) {
  return (
    <>
      <Head>
        <title>{record.street_name || 'Detalle de Propiedad'}</title>
        <meta name="description" content={record.remarks_es || record.remarks || ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={record.street_name || ''} />
        <meta property="og:description" content={record.remarks_es || record.remarks || ''} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`${SITE_URL}/${record.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* al componente ya le basta con record.imageUrls y los demás campos */}
      <PropertyDetail record={record} waHref={waHref} />
    </>
  )
}

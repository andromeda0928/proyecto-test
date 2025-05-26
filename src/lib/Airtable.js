// src/lib/Airtable.js

const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`
const HEADERS = {
  Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
}

const IMG_BASE_URL = 'https://panama-green.com/wp-content/uploads/images_mls'

/**
 * Construye array de URLs: uniqueId.L01 … uniqueId.LNN
 */
function buildImageUrls(uniqueId, count) {
  if (!uniqueId || count < 1) return []
  return Array.from({ length: count }, (_, i) => {
    const idx = String(i + 1).padStart(2, '0')
    return `${IMG_BASE_URL}/${uniqueId}.L${idx}`
  })
}

/**
 * Transforma un record raw de Airtable al modelo que usa tu UI.
 */
function mapRecord(record) {
  const f = record.fields || {}

  // Extraemos el count (puede venir con diferentes nombres en Airtable)
  const listingPhotoCount =
    f.listing_photo_count ??
    f['Listing Photo Count'] ??
    f.Listing_photo_count ??
    0

  const uniqueId = f.unique_id || null

  return {
    id: record.id,
    unique_id: uniqueId,
    listing_photo_count: listingPhotoCount,
    imageUrls: buildImageUrls(uniqueId, listingPhotoCount),

    // resto de campos
    street_name:      f.street_name      || '—',
    map_area:         f.map_area         || '—',
    district:         f.district         || '—',
    property_type:    f.property_type    || '—',
    titles: Array.isArray(f.title)
      ? f.title
      : typeof f.title === 'string'
        ? f.title.split(',').map(s => s.trim())
        : [],
    price_current:    f.price_current    || 0,
    bedrooms:         f.bedrooms         || 0,
    bathrooms:        f.bathrooms        || 0,
    parking_spaces:   f.parking_spaces   || 0,
    sqft_total:       f.sqft_total       || 0,
    lot_sqft:         f.lot_sqft         || 0,
    remarks_es:       f.remarks_es       || '',
    remarks:          f.remarks          || '',
    other_services:    f.other_services   || [],
    interior_features: f.interior_features|| [],
    exterior_features: f.exterior_features|| [],
  }
}

/**
 * Trae todos los records y los mapea para tu UI.
 */
export async function fetchAllProperties(tableName) {
  let all = []
  let offset

  do {
    const params = new URLSearchParams({ pageSize: '100' })
    if (offset) params.append('offset', offset)

    const res = await fetch(
      `${BASE_URL}/${encodeURIComponent(tableName)}?${params}`,
      { headers: HEADERS }
    )
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Airtable fetch failed: ${res.status}\n${text}`)
    }

    const { records, offset: nextOffset } = await res.json()
    all.push(...records)
    offset = nextOffset
  } while (offset)

  return all.map(mapRecord)
}

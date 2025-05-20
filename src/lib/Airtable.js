// File: src/lib/Airtable.js

const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`
const HEADERS = {
  Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
}

/** Mapea un record de Airtable a tu modelo Property */
function mapRecord(r) {
  const f = r.fields || {}
  return {
    id:             r.id,
    street_name:    f.street_name    || '—',
    map_area:       f.map_area       || '—',
    property_type:  f.property_type  || '—',
    titles: Array.isArray(f.title)
      ? f.title
      : typeof f.title === 'string'
        ? f.title.split(',').map(s => s.trim())
        : [],
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
}

/**
 * Recibe el nombre de tabla y devuelve todas las propiedades paginadas.
 * @param {string} tableName
 * @returns {Promise<Array>}
 */
export async function fetchAllProperties(tableName) {
  let all = []
  let offset

  do {
    const params = new URLSearchParams({ pageSize: '100' })
    if (offset) params.append('offset', offset)

    const url = `${BASE_URL}/${encodeURIComponent(tableName)}?${params}`
    const res = await fetch(url, { headers: HEADERS })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(
        `Airtable fetch failed: ${res.status} ${res.statusText}\n${url}\n${errText}`
      )
    }

    const { records, offset: nextOffset } = await res.json()
    all.push(...records)
    offset = nextOffset
  } while (offset)

  return all.map(mapRecord)
}

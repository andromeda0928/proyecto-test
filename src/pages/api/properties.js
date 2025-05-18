// src/pages/api/properties.js

export default async function handler(req, res) {
  const API_KEY    = process.env.AIRTABLE_API_KEY;
  const BASE_ID    = process.env.AIRTABLE_BASE_ID;
  const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

  const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  try {
    const response = await fetch(`${API_URL}?maxRecords=5`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Airtable responded with ${response.status}: ${response.statusText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Airtable fetch error:', error);
    return res.status(500).json({ error: 'Error al conectarse a Airtable' });
  }
}

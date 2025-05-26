// src/components/PropertyDetail/PropertyDetail.jsx

import { useState } from 'react'
import {
  FaBed,
  FaBath,
  FaCar,
  FaRulerCombined,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
} from 'react-icons/fa'
import styles from './PropertyDetail.module.css'

export default function PropertyDetail({ record, waHref }) {
  const {
    street_name,
    map_area,
    district,
    price_current,
    unique_id,
    imageUrls = [],
    bedrooms,
    bathrooms,
    parking_spaces,
    sqft_total,
    lot_sqft,
    remarks_es = '',
    interior_features = '',
    exterior_features = '',
  } = record

  // Helper: convierte CSV string o array en array limpio
  const toList = value => {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      return value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    }
    return []
  }

  // Preparamos la lista de características
  const features = [
    ...toList(interior_features),
    ...toList(exterior_features),
  ]

  // Carrusel
  const [current, setCurrent] = useState(0)
  const prev = () =>
    setCurrent(c => (c === 0 ? imageUrls.length - 1 : c - 1))
  const next = () =>
    setCurrent(c => (c === imageUrls.length - 1 ? 0 : c + 1))

  return (
    <div className={styles.container}>

      {/* HEADER */}
      <header className={styles.detailHeader}>
        <h2 className={styles.title}>{street_name?.toUpperCase()}</h2>
        <p className={styles.location}>{map_area}, {district}</p>
        <p className={styles.price}>${price_current.toLocaleString()}</p>
        <p className={styles.propertyId}>Property ID: {unique_id}</p>
      </header>

      {/* CARRUSEL */}
      <div className={styles.carousel}>
        {imageUrls.length > 0 ? (
          <>
            <button className={`${styles.carouselBtn} ${styles.left}`} onClick={prev}>
              <FaArrowLeft />
            </button>
            <img
              className={styles.carouselImage}
              src={imageUrls[current]}
              alt={street_name}
            />
            <button className={`${styles.carouselBtn} ${styles.right}`} onClick={next}>
              <FaArrowRight />
            </button>
          </>
        ) : (
          <div className={styles.noImage}>No hay imágenes</div>
        )}
      </div>

      {/* STATS */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {bedrooms > 0 && (
            <div className={styles.statItem}>
              <FaBed size={32}/>
              <span className={styles.statValue}>{bedrooms}</span>
              <span className={styles.statLabel}>Recámaras</span>
            </div>
          )}
          {bathrooms > 0 && (
            <div className={styles.statItem}>
              <FaBath size={32}/>
              <span className={styles.statValue}>{bathrooms}</span>
              <span className={styles.statLabel}>Baños</span>
            </div>
          )}
          {lot_sqft > 0 && (
            <div className={styles.statItem}>
              <FaRulerCombined size={32}/>
              <span className={styles.statValue}>{lot_sqft}</span>
              <span className={styles.statLabel}>Lote (m²)</span>
            </div>
          )}
          {sqft_total > 0 && (
            <div className={styles.statItem}>
              <FaRulerCombined size={32}/>
              <span className={styles.statValue}>{sqft_total}</span>
              <span className={styles.statLabel}>Construcción (m²)</span>
            </div>
          )}
          {parking_spaces > 0 && (
            <div className={`${styles.statItem} ${styles.parkingItem}`}>
              <FaCar size={32}/>
              <span className={styles.statValue}>{parking_spaces}</span>
              <span className={styles.statLabel}>Parkings</span>
            </div>
          )}
        </div>
      </section>

      {/* DESCRIPCIÓN */}
      <section className={styles.description}>
        <h3>DESCRIPCIÓN</h3>
        <p>{remarks_es}</p>
      </section>

      {/* CARACTERÍSTICAS: solo si hay al menos una */}
      {features.length > 0 && (
        <section className={styles.characteristics}>
          <h3>CARACTERÍSTICAS</h3>
          <div className={styles.charGrid}>
            {features.map((feat, i) => (
              <div key={i} className={styles.featureItem}>
                <FaCheck size={20} color="#8a00e9" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WHATSAPP */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.btnWhatsapp}
      >
        WHATSAPP
      </a>
    </div>
  )
}

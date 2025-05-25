// src/components/PropertyDetail/PropertyDetail.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  FaBed,
  FaBath,
  FaCar,
  FaRulerCombined,
  FaShareAlt,
  FaArrowLeft,
  FaCheck,
} from 'react-icons/fa'
import styles from './PropertyDetail.module.css'

export default function PropertyDetail({ record, imageUrls, waHref }) {
  const f = record.fields || {}
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  const prev = () =>
    setCurrent(c => (c === 0 ? imageUrls.length - 1 : c - 1))
  const next = () =>
    setCurrent(c => (c === imageUrls.length - 1 ? 0 : c + 1))

  return (
    <div className={styles.container}>
      {/* Botones superior */}
      <div className={styles.topBar}>
        <button onClick={() => router.back()} className={styles.iconBtn}>
          <FaArrowLeft />
        </button>
        <button
          onClick={() => window.open(waHref, '_blank')}
          className={styles.shareBtn}
        >
          <FaShareAlt />
        </button>
      </div>

      {/* Encabezado: título + ubicación + precio + ID */}
      <header className={styles.detailHeader}>
        <div className={styles.titleBlock}>
          <h2>{f.street_name}</h2>
          <p>
            {f.map_area}, {f.district}
          </p>
        </div>
        <div className={styles.priceBlock}>
          <p className={styles.price}>
            ${f.price_current?.toLocaleString() || '0'}
          </p>
          <p className={styles.propertyId}>
            Property ID: {record.id}
          </p>
        </div>
      </header>

      {/* Carrusel de imágenes + overlay stats */}
      <div className={styles.carousel}>
        {imageUrls.length > 0 ? (
          <>
            <button
              className={`${styles.carouselBtn} ${styles.left}`}
              onClick={prev}
            >
              ‹
            </button>
            <img
              src={imageUrls[current]}
              alt={f.street_name}
            />
            <button
              className={`${styles.carouselBtn} ${styles.right}`}
              onClick={next}
            >
              ›
            </button>
            <div className={styles.statsOverlay}>
              <div>
                <FaBed /> {f.bedrooms || 0}
              </div>
              <div>
                <FaBath /> {f.bathrooms || 0}
              </div>
              <div>
                <FaCar /> {f.parking_spaces || 0}
              </div>
              <div>
                <FaRulerCombined /> {f.sqft_total || 0} m²
              </div>
              <div>
                <FaRulerCombined /> {f.lot_sqft || 0} m²
              </div>
            </div>
          </>
        ) : (
          <div className={styles.noImage}>No hay imágenes</div>
        )}
      </div>

      {/* Descripción */}
      <section className={styles.description}>
        <h3>DESCRIPCIÓN</h3>
        <p>{f.remarks_es || f.remarks || 'Sin descripción.'}</p>
      </section>

      {/* Características */}
      <section className={styles.characteristics}>
        <h3>CARACTERÍSTICAS</h3>
        <div className={styles.charGrid}>
          {[
            ...(f.other_services || []),
            ...(f.interior_features || []),
            ...(f.exterior_features || []),
          ].map((item, i) => (
            <div key={i}>
              <FaCheck /> {item}
            </div>
          ))}
        </div>
      </section>

      {/* Botón WhatsApp */}
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

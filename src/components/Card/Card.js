// File: src/components/Card/Card.jsx
import React from 'react'
import styles from './Card.module.css'
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt
} from 'react-icons/fa'

export default function Card({ property }) {
  const thumb = property.urlImgs[0]
    ? `https://panama-green.com/wp-content/uploads/wpallimport/files/${property.urlImgs[0]}`
    : null

  return (
    <li className={styles.cardItem}>
      <a href={`/${property.id}`} className={styles.card}>
        {thumb ? (
          <img
            src={thumb}
            alt={property.street_name}
            className={styles.thumb}
          />
        ) : (
          <div className={styles.thumbPlaceholder}>Sin imagen</div>
        )}

        <div className={styles.cardBody}>
          <h2 className={styles.title}>{property.street_name}</h2>
          <p className={styles.subtitle}>{property.map_area}</p>

          <div className={styles.pills}>
            {/* Mostrar solo si bedrooms > 0 */}
            {property.bedrooms > 0 && (
              <div className={styles.pill}>
                <FaBed size={14} className={styles.pillIcon} />
                <span>{property.bedrooms}</span>
              </div>
            )}

            {/* Mostrar solo si bathrooms > 0 */}
            {property.bathrooms > 0 && (
              <div className={styles.pill}>
                <FaBath size={14} className={styles.pillIcon} />
                <span>{property.bathrooms}</span>
              </div>
            )}

            {/* Mostrar solo si sqft_total > 0 */}
            {property.sqft_total > 0 && (
              <div className={styles.pill}>
                <FaRulerCombined size={14} className={styles.pillIcon} />
                <span>{property.sqft_total}M2</span>
              </div>
            )}

            {/* Mostrar solo si lot_sqft > 0 */}
            {property.lot_sqft > 0 && (
              <div className={styles.pill}>
                <FaMapMarkerAlt size={14} className={styles.pillIcon} />
                <span>{property.lot_sqft}M2</span>
              </div>
            )}
          </div>

          <p className={styles.price}>
            ${property.price_current.toLocaleString()}
          </p>
        </div>
      </a>
    </li>
  )
}

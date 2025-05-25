// src/components/Card/Card.jsx
import React from 'react'
import styles from './Card.module.css'
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt
} from 'react-icons/fa'

const IMG_BASE_URL = 'https://panama-green.com/wp-content/uploads/images_mls'

function getFirstImageUrl(uniqueId) {
  if (!uniqueId) return null
  return `${IMG_BASE_URL}/${uniqueId}.L01`
}

export default function Card({ property }) {
  const imageUrl = getFirstImageUrl(property.unique_id)

  return (
    <li className={styles.cardItem}>
      <a href={`/${property.id}`} className={styles.card}>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.street_name}
            className={styles.thumb}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className={styles.thumbPlaceholder}>Sin imagen</div>
        )}

        <div className={styles.cardBody}>

          {/* Nuevo contenedor para título y subtítulo */}
          <div className={styles.cardHeader}>
            <h2 className={styles.title}>{property.street_name}</h2>
            <p className={styles.subtitle}>{property.map_area}</p>
          </div>

          <div className={styles.pills}>
            {property.bedrooms > 0 && (
              <div className={styles.pill}>
                <FaBed size={14} className={styles.pillIcon} />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className={styles.pill}>
                <FaBath size={14} className={styles.pillIcon} />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.sqft_total > 0 && (
              <div className={styles.pill}>
                <FaRulerCombined size={14} className={styles.pillIcon} />
                <span>{property.sqft_total} m²</span>
              </div>
            )}
            {property.lot_sqft > 0 && (
              <div className={styles.pill}>
                <FaMapMarkerAlt size={14} className={styles.pillIcon} />
                <span>{property.lot_sqft} m²</span>
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

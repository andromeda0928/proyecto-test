import styles from './Card.module.css';

export default function Card({ property }) {
  const thumb = property.urlImgs[0]
    ? `https://panama-green.com/wp-content/uploads/wpallimport/files/${property.urlImgs[0]}`
    : null;

  return (
    <li>
      <a href={`/${property.id}`} className={styles.card}>
        {thumb ? (
          <img src={thumb} alt={property.street_name} className={styles.thumb} />
        ) : (
          <div className={styles.thumbPlaceholder}>Sin imagen</div>
        )}
        <div className={styles.cardBody}>
          <h2>{property.street_name}</h2>
          <p className={styles.location}>{property.map_area}</p>
          <p className={styles.type}>{property.property_type}</p>
          <p className={styles.price}>${property.price_current.toLocaleString()}</p>
        </div>
      </a>
    </li>
  );
}
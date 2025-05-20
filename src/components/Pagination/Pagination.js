import styles from './Pagination.module.css'

export default function Pagination({ pageNum, totalPages, pagesArray, onPageChange }) {
  return (
    <nav className={styles.pagination}>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(pageNum - 1)}
        disabled={pageNum === 1}
      >
        ‹
      </button>

      {pagesArray.map((p, idx) =>
        p === '...'
          ? <span key={idx} className={styles.dots}>…</span>
          : <button
              key={idx}
              className={`${styles.pageBtn} ${p === pageNum ? styles.active : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
      )}

      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(pageNum + 1)}
        disabled={pageNum === totalPages}
      >
        ›
      </button>
    </nav>
  )
}

import { useState, useEffect } from 'react'
import styles from './Pagination.module.css'

export default function Pagination({ pageNum, totalPages, onPageChange }) {
  const [pagesToShow, setPagesToShow] = useState([])

  useEffect(() => {
    const calcPages = () => {
      const isMobile = window.innerWidth < 480   // breakpoint a 480px
      const maxButtons = isMobile ? 3 : 5
      setPagesToShow(getPageItems(pageNum, totalPages, maxButtons))
    }

    calcPages()
    window.addEventListener('resize', calcPages)
    return () => window.removeEventListener('resize', calcPages)
  }, [pageNum, totalPages])

  return (
    <nav className={styles.pagination}>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(pageNum - 1)}
        disabled={pageNum === 1}
      >
        ‹
      </button>

      {pagesToShow.map((p, idx) =>
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

// Genera un array de páginas con '...' si hace falta
function getPageItems(current, total, maxButtons) {
  const pages = []
  if (total <= maxButtons) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    const half = Math.floor(maxButtons / 2)
    let start = current - half
    let end = current + half

    if (start < 1) {
      start = 1
      end = maxButtons
    }
    if (end > total) {
      end = total
      start = total - maxButtons + 1
    }

    for (let i = start; i <= end; i++) pages.push(i)

    if (pages[0] > 1) {
      pages.unshift('...')
      pages.unshift(1)
    }
    if (pages[pages.length - 1] < total) {
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
}

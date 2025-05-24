// src/components/FloatingButtons/FloatingButtons.jsx
import { useEffect, useState } from 'react'
import styles from './FloatingButtons.module.css'
import { FaWhatsapp, FaArrowUp } from 'react-icons/fa'

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.container}>
      <a
        href="https://wa.me/50765925398"
        className={styles.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a>

      {visible && (
        <button onClick={scrollToTop} className={styles.scrollTop} aria-label="Subir arriba">
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  )
}

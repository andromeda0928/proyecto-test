// File: src/components/FloatingButtons/FloatingButtons.jsx
import { useEffect, useState } from 'react'
import styles from './FloatingButtons.module.css'
import { FaWhatsapp, FaArrowUp, FaShareAlt } from 'react-icons/fa'

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const sharePage = async () => {
    const url = window.location.href
    const title = document.title || 'Página'
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (err) {
        console.error('Error compartiendo:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        alert('URL copiada al portapapeles')
      } catch (err) {
        console.error('Error copiando al portapapeles:', err)
      }
    }
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

      <button
        onClick={sharePage}
        className={styles.share}
        aria-label="Compartir página"
      >
        <FaShareAlt size={20} />
      </button>

      {visible && (
        <button
          onClick={scrollToTop}
          className={styles.scrollTop}
          aria-label="Subir arriba"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  )
}
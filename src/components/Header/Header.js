// File: src/components/Header/Header.js
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from './Header.module.css'

export default function Header({ children }) {
  const router = useRouter()
  const defaultUrl = 'https://andromedahlstudio.com'

  const handleBack = (e) => {
    e.preventDefault()
    if (router.pathname !== '/') {
      router.back()
    } else {
      router.push(defaultUrl)
    }
  }

  return (
    <>
      <header className={styles.header}>
        {/* Logo */}
        <a
          href={defaultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoLink}
        >
          <div className={styles.logoWrapper}>
            <Image
              src="/logo.png"
              alt="Andrómeda HL Studio"
              fill
              className={styles.logoImage}
              priority
            />
          </div>
        </a>

        {/* Botón “Regresar” */}
        <button
          type="button"
          onClick={handleBack}
          className={styles.backButton}
        >
          REGRESAR
        </button>
      </header>

      <main className={styles.main}>{children}</main>
    </>
  )
}

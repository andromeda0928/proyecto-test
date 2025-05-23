// File: src/components/Layout/Layout.js
import React from 'react'
import Image from 'next/image'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <>
      <header className={styles.header}>
        {/* Logo clickeable */}
        <a
          href="https://andromedahlstudio.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoLink}
        >
          <div className={styles.logoWrapper}>
            <Image
              src="/Logo-Andromeda-Blanco-1024x907.webp"
              alt="Andrómeda HL Studio"
              fill
              className={styles.logoImage}
              priority
            />
          </div>
        </a>

        {/* Botón “Regresar” */}
        <a
          href="https://andromedahlstudio.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.backButton}
        >
          REGRESAR
        </a>
      </header>

      {/* Contenido de la página */}
      <main className={styles.main}>{children}</main>
    </>
  )
}

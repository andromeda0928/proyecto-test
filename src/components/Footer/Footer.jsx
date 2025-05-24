import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.label}>DESARROLLADO POR</p>
      <p className={styles.brand}>LISTING PANAMÁ</p>
    </footer>
  )
}

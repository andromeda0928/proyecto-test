import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FloatingButtons from '@/components/FloatingButtons/FloatingButtons'

import '@/styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header>
        <Component {...pageProps} />
      </Header>
      <Footer />
      <FloatingButtons />
    </>
  )
}

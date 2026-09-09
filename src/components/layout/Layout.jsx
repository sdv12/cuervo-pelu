import Nav from './Nav'
import Footer from './Footer'
import FloatingWhatsApp from './FloatingWhatsApp'

export default function Layout({ children }) {
  return (
    <div id="top">
      <Nav />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

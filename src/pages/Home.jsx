import Hero from '../components/sections/Hero'
import BookingWidget from '../components/booking/BookingWidget'
import WhyUs from '../components/sections/WhyUs'
import Gallery from '../components/sections/Gallery'
import Amenidades from '../components/sections/Amenidades'
import Services from '../components/sections/Services'
import AdSlot from '../components/ads/AdSlot'
import Testimonials from '../components/sections/Testimonials'
import FidelityCard from '../components/sections/FidelityCard'
import InfoSection from '../components/sections/InfoSection'

export default function Home() {
  return (
    <>
      <Hero />
      <BookingWidget />
      <WhyUs />
      <Gallery />
      <Amenidades />
      <Services />
      <AdSlot slot="servicios" />
      <Testimonials />
      <FidelityCard />
      <InfoSection />
    </>
  )
}

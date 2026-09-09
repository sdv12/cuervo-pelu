import Hero from '../components/sections/Hero'
import AdSlot from '../components/ads/AdSlot'
import BookingWidget from '../components/booking/BookingWidget'
import WhyUs from '../components/sections/WhyUs'
import Gallery from '../components/sections/Gallery'
import Amenidades from '../components/sections/Amenidades'
import Services from '../components/sections/Services'
import Testimonials from '../components/sections/Testimonials'
import FidelityCard from '../components/sections/FidelityCard'
import InfoSection from '../components/sections/InfoSection'

export default function Home() {
  return (
    <>
      <Hero />
      <AdSlot slot="hero" />
      <BookingWidget />
      <WhyUs />
      <Gallery />
      <Amenidades />
      <Services />
      <Testimonials />
      <FidelityCard />
      <InfoSection />
    </>
  )
}

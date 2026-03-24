import React from 'react'
import Hero from '../components/Hero.jsx'
import FeaturedDestination from '../components/Featured-Destination.jsx'
import ExclusiveOffers from '../components/Exclusive-offers.jsx'
import Testimonial from '../components/Testimonial.jsx'
import Newsletter from '../components/Newsletter.jsx'



const Home = () => {
  return (
    <>
      <Hero />
      
      <FeaturedDestination />
      <ExclusiveOffers />
      <Testimonial />
      <Newsletter />
    </>
  )
}

export default Home
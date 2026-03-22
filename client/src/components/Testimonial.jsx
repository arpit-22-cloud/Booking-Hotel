import React from 'react'
import { testimonials } from '../assets/assets.js'
import Title from './Title.jsx'
import StarRating from './Star-rating.jsx'

const Testimonial = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px24">
      
        <Title title="What Our Guest Say" subtitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world." />
        <div className="flex flex-wrap items-center  gap-6 mt-20 ">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow ">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="font-playfair text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                           <StarRating/>
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4">"{testimonial.review}"</p>
                    </div>
                ))}
            </div>
      </div>
  
  )
}

export default Testimonial
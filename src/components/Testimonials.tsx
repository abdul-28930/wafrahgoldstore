"use client";

import { FC, useState } from 'react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

const Testimonials: FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Bride",
      quote: "The bridal collection from RICH CHIDAMBARAM GOLD COVERING exceeded my expectations. The craftsmanship is exquisite and the designs are timeless. I received countless compliments on my wedding day!",
      rating: 5
    },
    {
      id: 2,
      name: "Raj Malhotra",
      role: "Businessman",
      quote: "I purchased a gold chain for my father's 60th birthday. The quality is outstanding and the customer service was exceptional. Will definitely shop here again.",
      rating: 5
    },
    {
      id: 3,
      name: "Ananya Patel",
      role: "Fashion Influencer",
      quote: "As someone who wears jewelry daily, I can attest to the superior quality of RICH CHIDAMBARAM GOLD COVERING pieces. Their contemporary designs stand out while maintaining traditional craftsmanship.",
      rating: 4
    },
    {
      id: 4,
      name: "Vikram Singh",
      role: "Anniversary Gift",
      quote: "The diamond pendant I purchased for our anniversary was stunning. My wife was speechless when she opened it. Worth every rupee spent!",
      rating: 5
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">What Our Clients Say About Us</h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-amber-600 p-2 rounded-full shadow-md hover:bg-amber-50"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-amber-600 p-2 rounded-full shadow-md hover:bg-amber-50"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Testimonial Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-amber-200">
                  <Image 
                   src={"/default-avatar.svg"}
                    alt={testimonials[activeIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-4 text-amber-600">
                  <svg width="40" height="40" fill="currentColor" className="opacity-20">
                    <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" />
                  </svg>
                </div>

                <p className="text-gray-700 italic mb-6 text-lg">{testimonials[activeIndex].quote}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-amber-800">{testimonials[activeIndex].name}</h3>
                    <p className="text-gray-600">{testimonials[activeIndex].role}</p>
                  </div>

                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill={i < testimonials[activeIndex].rating ? "#d4af37" : "#e5e7eb"}
                      >
                        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.401 8.165L12 18.896 4.665 23.157 6.066 15l-5.934-5.782 8.2-1.192z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === activeIndex ? 'bg-amber-600' : 'bg-amber-200'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
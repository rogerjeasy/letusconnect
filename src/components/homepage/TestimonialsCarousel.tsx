"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Link from "next/link";
import ImageZoom from "../forms/ImageZoom";

interface Testimonial {
  name: string;
  title: string;
  quote: string;
  photo: string;
}

const testimonials: Testimonial[] = [
    {
      name: "Alice Johnson",
      title: "Data Scientist at TechCorp",
      quote: "This platform helped me connect with amazing mentors who guided me through my career journey.",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Mark Smith",
      title: "AI Researcher at InnovateLab",
      quote: "I found incredible collaboration opportunities here that led to my first successful research project.",
      photo: "https://randomuser.me/api/portraits/men/34.jpg",
    },
    {
      name: "Sophia Lee",
      title: "Product Manager at StartupHub",
      quote: "The networking features allowed me to meet like-minded alumni and advance my career.",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "James Carter",
      title: "Current Master's Student",
      quote: "The collaborative projects helped me apply my skills in real-world scenarios and learn from alumni.",
      photo: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      name: "Emily Davis",
      title: "Alumnus, Data Analyst at FinTechPro",
      quote: "The mentorship program gave me the confidence and skills to secure my dream job.",
      photo: "https://randomuser.me/api/portraits/women/19.jpg",
    },
    {
      name: "Dr. Robert Williams",
      title: "Industry Expert & Mentor",
      quote: "I enjoy giving back to the community and helping students grow into successful professionals.",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "Laura Martinez",
      title: "Entrepreneur & Startup Founder",
      quote: "This platform connected me with brilliant minds who became co-founders of my startup.",
      photo: "https://randomuser.me/api/portraits/women/25.jpg",
    },
    {
      name: "Daniel Kim",
      title: "Software Engineer at DevSolutions",
      quote: "The job board and career resources made my job search easy and efficient.",
      photo: "https://randomuser.me/api/portraits/men/28.jpg",
    },
    {
      name: "Amara Patel",
      title: "UX Designer at CreateSpace",
      quote: "I found design collaboration opportunities that helped me build an impressive portfolio.",
      photo: "https://randomuser.me/api/portraits/women/31.jpg",
    },
    {
      name: "William Thompson",
      title: "Marketing Consultant",
      quote: "The platform’s events and webinars helped me stay updated with industry trends and expand my network.",
      photo: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];  

export default function TestimonialsCarousel() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 leading-tight">
          Success Stories from Our Community
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full max-w-6xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center">
                {/* Responsive Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-4">
                  <ImageZoom
                    src={testimonial.photo}
                    alt={testimonial.name}
                    // width={112}
                    // height={112}
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>

                {/* Responsive Quote */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl italic mb-4 leading-snug sm:leading-relaxed md:leading-loose max-w-prose mx-auto">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Responsive Name */}
                <h3 className="text-lg sm:text-xl font-bold">{testimonial.name}</h3>

                {/* Responsive Title */}
                <p className="text-sm sm:text-base text-gray-500">{testimonial.title}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CTA Button */}
        <div className="mt-8">
          <Link href="/testimonials">
            <button className="bg-teal-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-600 transition">
              Read More Stories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
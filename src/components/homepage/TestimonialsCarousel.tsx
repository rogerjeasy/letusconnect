"use client";

import * as React from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  // Add breakpoint detection
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initially
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="py-6 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-8 leading-tight">
          Success Stories from Our Community
        </h2>

        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-6xl mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3"
              >
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center p-4 md:p-6 h-full">
                      <div className="w-16 h-16 md:w-24 md:h-24 mb-3 md:mb-4 flex-shrink-0">
                        <ImageZoom
                          src={testimonial.photo}
                          alt={testimonial.name}
                          className="rounded-full w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-grow flex flex-col justify-between w-full">
                        <p className="text-sm md:text-base italic mb-3 md:mb-4 line-clamp-3">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>

                        <div>
                          <h3 className="text-sm md:text-lg font-bold">
                            {testimonial.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500">
                            {testimonial.title}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {!isMobile && (
            <>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </>
          )}
        </Carousel>

        <div className="mt-6 md:mt-8">
          <Link href="/testimonials">
            <button className="bg-teal-500 text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg font-bold hover:bg-teal-600 transition">
              Read More Stories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from 'embla-carousel-autoplay';

interface Testimonial {
  name: string;
  title: string;
  quote: string;
  photo: string;
}

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
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
      quote: "The platform's events and webinars helped me stay updated with industry trends and expand my network.",
      photo: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ]; 

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const next = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">What Our Users Say</h2>
        </div>
        
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent className="gap-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem 
                  key={index} 
                  className={isMobile ? "basis-full" : "basis-1/3"}
                >
                  <Card className="transform transition-transform duration-500 ease-in-out">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={testimonial.photo} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <blockquote className="text-lg italic">"{testimonial.quote}"</blockquote>
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-gray-600">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
              <CarouselPrevious className="relative pointer-events-auto h-12 w-12 rounded-full bg-white shadow-lg border-2 border-gray-200 opacity-90 hover:opacity-100" >
                <ChevronLeft className="h-8 w-8" />
              </CarouselPrevious>
              <CarouselNext className="relative pointer-events-auto h-12 w-12 rounded-full bg-white shadow-lg border-2 border-gray-200 opacity-90 hover:opacity-100">
                <ChevronRight className="h-8 w-8" />
              </CarouselNext>
            </div>
          </Carousel>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
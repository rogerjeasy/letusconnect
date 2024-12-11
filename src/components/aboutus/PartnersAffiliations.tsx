"use client";

import { Card } from "@nextui-org/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Partner {
  name: string;
  logo: string;
  website: string;
}

const partners: Partner[] = [
  {
    name: "Harvard University",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Harvard_shield_wreath.svg",
    website: "https://www.harvard.edu",
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    website: "https://www.google.com",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    website: "https://www.microsoft.com",
  },
  {
    name: "MIT",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg",
    website: "https://www.mit.edu",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    website: "https://www.amazon.com",
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    website: "https://www.ibm.com",
  },
  {
    name: "Stanford University",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Stanford_Cardinal_logo.svg",
    website: "https://www.stanford.edu",
  },
];

export default function PartnersAffiliations() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
          Our Partners and Affiliations
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          We collaborate with top universities, industry leaders, and organizations to provide the best resources, opportunities, and support to our community.
        </p>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            480: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="w-full"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-40 h-40 md:w-48 md:h-48 p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <Card className="flex items-center justify-center h-full p-4">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-20 max-w-full object-contain"
                  />
                </Card>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
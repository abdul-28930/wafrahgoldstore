"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";


interface SliderBanner {
  id:number
  url: string;
  title?: string;
  subtitle?: string;
}

const defaultBanners: SliderBanner[] = [
  {
id:1,
    url: "/banners/goldbanner1.jpg",
    title: "LUXURY GOLD COLLECTION",
    subtitle: "Timeless Elegance for Every Occasion",

  },
  {
id:2,
    url: "/banners/goldbanner2.jpg",
    title: "BRIDAL COLLECTION",
    subtitle: "Make Your Special Day Unforgettable",
  },
];

const HeroBanner: FC = () => {
  const [banners, setBanners] = useState<SliderBanner[]>(defaultBanners);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchAdminBanners = async () => {
      try {
        const res = await fetch("/api/slider");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const validated = data
            .filter((b: any) => b.url)
            .map((b: any, i: number) => ({
              id: i + 1,
              url: b.url || defaultBanners[i % defaultBanners.length].url,
              title: b.title || defaultBanners[i % defaultBanners.length].title,
              subtitle: b.subtitle || defaultBanners[i % defaultBanners.length].subtitle,
            }));
  
            if (validated.length > 0) setBanners(validated);
          }
        }
      } catch (error) {
        console.error("Failed to fetch banners, using default ones.");
      }
    };
  
    fetchAdminBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  const goToBanner = (index: number) => {
    setCurrentBanner(index);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-r from-amber-50 to-amber-100">
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div

          key={`banner-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBanner ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
       <Image
  src={banner.url || "/banners/default.jpg"}
  alt={banner.title ||"Banner Image"}
  fill
  priority={index === 0}
  className="object-cover"
/>
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
              <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">{banner.title}</h1>
              <p className="mt-2 text-lg md:text-2xl">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-amber-800 p-2 rounded-full shadow-md hover:bg-amber-50 z-10"
      >
        &larr;
      </button>
      <button
        onClick={() =>
          setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-amber-800 p-2 rounded-full shadow-md hover:bg-amber-50 z-10"
      >
        &rarr;
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToBanner(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentBanner ? "bg-amber-600" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
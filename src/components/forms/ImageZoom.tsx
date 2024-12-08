// components/ImageZoom.tsx
"use client";

import { Image } from "@nextui-org/react";

interface ImageZoomProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageZoom({ src, alt, className="rounded-full mb-4 object-cover", width = 100, height = 100 }: ImageZoomProps) {
  return (
    <Image
      isZoomed
      alt={alt}
      src={src}
      width={width}
      height={height}
      className={className}
    />
  );
}
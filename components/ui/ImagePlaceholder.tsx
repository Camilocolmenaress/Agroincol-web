'use client';

import { Camera } from 'lucide-react';

interface ImagePlaceholderProps {
  description: string;
  width: string;
  height: string;
  className?: string;
}

export default function ImagePlaceholder({ description, width, height, className = '' }: ImagePlaceholderProps) {
  return (
    <div
      className={`bg-brand-gray-light border-2 border-dashed border-brand-green rounded-lg flex flex-col items-center justify-center gap-3 p-4 ${width} ${height} ${className}`}
    >
      <Camera size={32} className="text-brand-gray" />
      <p className="text-brand-gray text-sm font-body text-center">{description}</p>
    </div>
  );
}

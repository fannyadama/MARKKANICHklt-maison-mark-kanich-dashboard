import React, { useState } from 'react';
import { KLT_LOGO_PATH } from '../data/kltSeedData';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BrandMarkProps['size']>, string> = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-lg',
  lg: 'w-14 h-14 rounded-xl',
  xl: 'w-28 h-28 rounded-2xl',
};

export const BrandMark: React.FC<BrandMarkProps> = ({ size = 'md', className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <div
        className={`${SIZE_CLASSES[size]} bg-slate-900 border border-amber-500/40 flex items-center justify-center shrink-0 ${className}`}
        aria-label="KLT Logo"
      >
        <span className="font-serif-luxury font-bold text-amber-400 text-sm">KLT</span>
      </div>
    );
  }

  return (
    <img
      src={KLT_LOGO_PATH}
      alt="Maison Mark Kanich — Kanich Luxury Token ($KLT)"
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className={`${SIZE_CLASSES[size]} object-cover border border-amber-500/30 bg-slate-900 shrink-0 ${className}`}
    />
  );
};

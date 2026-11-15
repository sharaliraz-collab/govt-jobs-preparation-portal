'use client';

import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot?: string;
  format?: 'horizontal' | 'rectangle' | 'in-article' | 'auto';
  className?: string;
  label?: string;
}

const formatMinHeight: Record<NonNullable<AdSlotProps['format']>, string> = {
  horizontal: 'min-h-[90px] sm:min-h-[100px]',
  rectangle: 'min-h-[250px]',
  'in-article': 'min-h-[120px] sm:min-h-[160px]',
  auto: 'min-h-[100px]',
};

export default function AdSlot({
  slot,
  format = 'horizontal',
  className = '',
  label = 'Sponsored Advertisement',
}: AdSlotProps) {
  const pushedRef = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || pushedRef.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Ignore blocker or hydration race
    }
  }, [clientId]);

  if (!clientId) {
    return null;
  }

  return (
    <aside
      aria-label={label}
      className={`w-full my-6 no-print ${className}`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold text-center mb-1">
          {label}
        </div>
        <div
          className={`w-full rounded-xl bg-white/50 border border-slate-200/70 flex items-center justify-center overflow-hidden ${formatMinHeight[format]}`}
        >
          <ins
            className="adsbygoogle block w-full"
            style={{ display: 'block' }}
            data-ad-client={clientId}
            data-ad-slot={slot || ''}
            data-ad-format={format === 'in-article' ? 'fluid' : 'auto'}
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </aside>
  );
}

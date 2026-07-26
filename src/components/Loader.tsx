import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Custom pulsing seal */}
      <div className="relative w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-full bg-govt-emerald/10 animate-ping" />
        <div className="absolute inset-1 rounded-full bg-govt-emerald/20 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-govt-emerald to-emerald-700 flex items-center justify-center shadow-glow-emerald">
          <span className="text-white font-extrabold text-[10px] tracking-tight">GJ</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-govt-muted">{message}</p>
    </div>
  );
};

/* Skeleton card variant for content loading */
export const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-govt-border p-5 space-y-3 animate-fade-in">
    <div className="flex items-center gap-2">
      <div className="skeleton h-5 w-20 rounded-full" />
      <div className="skeleton h-5 w-16 rounded-full" />
    </div>
    <div className="skeleton h-5 w-3/4" />
    <div className="skeleton h-4 w-full" />
    <div className="skeleton h-4 w-2/3" />
    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-8 w-24 rounded-lg" />
    </div>
  </div>
);

export default Loader;

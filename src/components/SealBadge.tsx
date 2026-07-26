import React from 'react';
import { Award, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SealBadgeProps {
  status?: string;
  type?: string;
}

const SealBadge: React.FC<SealBadgeProps> = ({ status = 'OPEN', type = 'open' }) => {
  let badgeStyle = 'bg-govt-emerald/10 text-govt-emerald border-govt-emerald/30';
  let Icon = CheckCircle;
  let pulseClass = '';

  if (type === 'closing_soon' || status === 'CLOSING SOON') {
    badgeStyle = 'bg-amber-500/10 text-amber-700 border-amber-400/30';
    Icon = Clock;
  } else if (type === 'closed' || status === 'CLOSED') {
    badgeStyle = 'bg-govt-red/10 text-govt-red border-govt-red/30';
    Icon = AlertTriangle;
  } else if (type === 'featured' || status === 'OFFICIAL') {
    badgeStyle = 'bg-govt-gold/10 text-yellow-800 border-govt-gold/30';
    Icon = Award;
  } else if (type === 'open' || status === 'OPEN') {
    pulseClass = 'animate-pulse-glow';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeStyle} ${pulseClass}`}>
      <Icon className="w-3 h-3" />
      <span>{status}</span>
    </span>
  );
};

export default SealBadge;

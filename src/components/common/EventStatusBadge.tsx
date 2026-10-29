import React from 'react';
import { EventStatus } from '../../types';
import { Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Props {
  status: EventStatus;
  registrationStatusLabel?: string;
  className?: string;
}

export const EventStatusBadge: React.FC<Props> = ({
  status,
  registrationStatusLabel,
  className = '',
}) => {
  if (status === 'completed') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
      >
        <CheckCircle2 className="w-3 h-3 text-slate-500" />
        <span>Concluded</span>
      </span>
    );
  }

  if (status === 'ongoing') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>Happening Now</span>
      </span>
    );
  }

  if (status === 'cancelled') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
      >
        <XCircle className="w-3 h-3 text-rose-500" />
        <span>Cancelled</span>
      </span>
    );
  }

  // Upcoming
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 ${className}`}
    >
      <Calendar className="w-3 h-3 text-indigo-500" />
      <span>{registrationStatusLabel || 'Upcoming'}</span>
    </span>
  );
};

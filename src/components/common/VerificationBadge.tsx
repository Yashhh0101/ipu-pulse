import React from 'react';
import { VerificationStatus } from '../../types';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface Props {
  status: VerificationStatus;
  isFictionalDemo?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<Props> = ({ status, isFictionalDemo, className = '' }) => {
  if (isFictionalDemo) {
    return (
      <span
        title="This is a demonstration listing for prototype preview. Not a real campus event."
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
      >
        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
        <span>DEMO LISTING — NOT A REAL EVENT</span>
      </span>
    );
  }

  if (status === 'verified') {
    return (
      <span
        title="Verified official campus record"
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>Verified Official</span>
      </span>
    );
  }

  if (status === 'pending_verification') {
    return (
      <span
        title="Submitted by society and awaiting moderator confirmation"
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
      >
        <Clock className="w-3 h-3 text-slate-500 shrink-0" />
        <span>Pending Review</span>
      </span>
    );
  }

  return (
    <span
      title="Unverified demonstration directory listing subject to confirmation"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
    >
      <AlertTriangle className="w-3 h-3 text-slate-500 shrink-0" />
      <span>Demo Record (Unverified)</span>
    </span>
  );
};

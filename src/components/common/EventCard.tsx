import React, { useState } from 'react';
import { CampusEvent } from '../../types';
import { appStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { computeEventStatus, formatEventDateTime } from '../../utils/rules';
import { EligibilityBadge } from './EligibilityBadge';
import { EventStatusBadge } from './EventStatusBadge';
import { VerificationBadge } from './VerificationBadge';
import { MapPin, Bookmark, Calendar, ArrowRight, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReportModal } from './ReportModal';

interface Props {
  event: CampusEvent;
}

export const EventCard: React.FC<Props> = ({ event }) => {
  const { savedEvents, toggleSaveEvent } = useAuth();
  const [reportOpen, setReportOpen] = useState(false);
  const college = appStore.getCollegeById(event.collegeId);
  const society = appStore.getSocietyById(event.societyId);

  const { status, registrationStatusLabel } = computeEventStatus(event);
  const isSaved = savedEvents.includes(event.id);
  const { formatted } = formatEventDateTime(event.startAt);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
      {/* Poster image container */}
      <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
        <img
          src={event.posterUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-auto">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
              {event.category}
            </span>
            {event.isPaid ? (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500 text-white shadow-xs">
                ₹{event.entryFee}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-600 text-white shadow-xs">
                Free
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleSaveEvent(event.id)}
              aria-label={isSaved ? 'Remove from saved' : 'Save event'}
              className={`p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:text-indigo-600'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              onClick={() => setReportOpen(true)}
              title="Report inaccurate info"
              aria-label="Report inaccurate info"
              className="p-1.5 rounded-full bg-white/80 text-slate-500 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom overlay in image: College & Society badge */}
        <div className="absolute bottom-2 left-3 right-3 text-white flex items-center justify-between">
          <div className="text-xs font-medium truncate drop-shadow-xs">
            <span>{society?.name || 'Society'}</span>
            <span className="mx-1.5 text-white/60">•</span>
            <span className="text-white/90">{college?.abbreviation || 'IPU'}</span>
          </div>
          <EventStatusBadge status={status} registrationStatusLabel={registrationStatusLabel} />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Demo Listing Notice */}
          <div className="mb-2">
            <VerificationBadge
              status={event.verificationStatus}
              isFictionalDemo={event.isFictionalDemo}
            />
          </div>

          <Link to={`/events/${event.id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-1.5 leading-snug">
              {event.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {event.description}
          </p>

          {/* Meta details */}
          <div className="space-y-1.5 text-xs text-slate-600 mb-3 border-t border-slate-100 pt-2.5">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-medium">{formatted}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <EligibilityBadge type={event.eligibilityType} />
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="event"
        targetId={event.id}
        targetTitle={event.title}
      />
    </div>
  );
};

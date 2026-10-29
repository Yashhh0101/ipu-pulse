import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { appStore } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { computeEventStatus, formatEventDateTime, evaluateOutsiderEligibility } from '../utils/rules';
import { EligibilityBadge } from '../components/common/EligibilityBadge';
import { EventStatusBadge } from '../components/common/EventStatusBadge';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { ReportModal } from '../components/common/ReportModal';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  Bookmark,
  Share2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Flag,
  Mail,
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, savedEvents, toggleSaveEvent } = useAuth();
  const { selectedCollegeId } = useCollege();
  const [reportOpen, setReportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const event = appStore.getEventById(eventId || '');

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested event listing does not exist or has been removed.</p>
        <Link to="/events" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg">
          Browse Events
        </Link>
      </div>
    );
  }

  const college = appStore.getCollegeById(event.collegeId);
  const society = appStore.getSocietyById(event.societyId);
  const isSaved = savedEvents.includes(event.id);

  const { status, isRegistrationCurrentlyOpen, registrationStatusLabel } = computeEventStatus(event);
  const { formatted: startFormatted } = formatEventDateTime(event.startAt);
  const { formatted: endFormatted } = formatEventDateTime(event.endAt);
  const { formatted: deadlineFormatted } = formatEventDateTime(event.registrationDeadline);

  // Check if current user is eligible based on their selected college
  const eligibilityEvaluation = evaluateOutsiderEligibility(
    event.eligibilityType,
    user?.selectedCollegeId || selectedCollegeId,
    event.collegeId,
    event.allowedColleges
  );

  // Check if already registered
  const userRegistrations = user ? appStore.getUserRegistrations(user.id) : [];
  const existingReg = userRegistrations.find(
    (r) => r.eventId === event.id && r.status !== 'cancelled'
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Main Event Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Banner Poster */}
        <div className="relative h-64 sm:h-80 md:h-96 bg-slate-900 overflow-hidden">
          <img
            src={event.posterUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-90"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Top floating actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-xs font-semibold text-slate-700 hover:bg-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={() => toggleSaveEvent(event.id)}
              className={`p-2 rounded-lg backdrop-blur-xs transition-colors shadow-xs cursor-pointer ${
                isSaved
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-indigo-600'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => setReportOpen(true)}
              title="Report inaccurate listing"
              className="p-2 rounded-lg bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white shadow-xs cursor-pointer"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom title in poster */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-600 text-white shadow-xs">
                {event.category}
              </span>
              <EventStatusBadge status={status} registrationStatusLabel={registrationStatusLabel} />
              {event.isPaid ? (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-white">
                  ₹{event.entryFee} Entry Fee
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white">
                  Free Registration
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Demo Listing Alert Bar */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">
              DEMONSTRATION LISTING — NOT A REAL EVENT:
            </span>
            <span className="hidden sm:inline text-amber-800">
              This event is generated as safe prototype seed data for evaluation.
            </span>
          </div>
          <VerificationBadge status={event.verificationStatus} />
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">About This Event</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Outsider Eligibility Card */}
            <div className="p-5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Outsider Eligibility & Participation Rules</span>
                </h3>
                <EligibilityBadge type={event.eligibilityType} />
              </div>

              <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                {event.eligibilityDescription}
              </p>

              {/* Requirement notice */}
              <div className="p-3 bg-white/80 rounded-lg border border-indigo-100 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Important Venue Entry Notice</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Successful online registration does not automatically override on-campus security policies. All participants must present a valid physical college ID card at the campus security checkpoint.
                </p>
              </div>
            </div>

            {/* Key Schedule Information */}
            <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm">Schedule & Venue Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 font-medium">Event Commences</span>
                  <p className="font-semibold text-slate-900">{startFormatted}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 font-medium">Event Concludes</span>
                  <p className="font-semibold text-slate-900">{endFormatted}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 font-medium">Registration Closes</span>
                  <p className="font-semibold text-rose-600">{deadlineFormatted}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 font-medium">Format & Venue</span>
                  <p className="font-semibold text-slate-900">{event.venue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration CTA & Organiser */}
          <div className="space-y-6">
            {/* Action Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Entry Status</span>
                <span
                  className={`text-xs font-bold ${
                    isRegistrationCurrentlyOpen ? 'text-emerald-600' : 'text-slate-500'
                  }`}
                >
                  {registrationStatusLabel}
                </span>
              </div>

              {existingReg ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-900">You Are Registered</p>
                  <p className="text-[11px] text-emerald-700">
                    Registration ID: #{existingReg.id}
                  </p>
                  <Link
                    to="/profile"
                    className="block text-xs font-semibold text-emerald-800 underline mt-1"
                  >
                    View in Your Profile
                  </Link>
                </div>
              ) : isRegistrationCurrentlyOpen ? (
                <div className="space-y-3">
                  <Link
                    to={`/events/${event.id}/register`}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Register for Event</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-slate-500">
                    {event.registrationMode === 'external'
                      ? 'Registration handled via official organizer form.'
                      : 'Fast internal registration with instant pass.'}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-100 rounded-xl text-center space-y-1">
                  <p className="text-xs font-bold text-slate-700">Registration is Closed</p>
                  <p className="text-[11px] text-slate-500">
                    {status === 'completed'
                      ? 'This event has concluded.'
                      : 'The deadline for entries has passed or capacity is full.'}
                  </p>
                </div>
              )}
            </div>

            {/* Organiser Profile */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Organised By</h4>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm shrink-0">
                  {society?.name.substring(0, 2).toUpperCase() || 'SO'}
                </div>
                <div>
                  <Link
                    to={`/colleges/${college?.id}/societies/${society?.id}`}
                    className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-sm"
                  >
                    {society?.name || 'Campus Society'}
                  </Link>
                  <p className="text-xs text-slate-500">{college?.name || 'IPU College'}</p>
                </div>
              </div>

              {society?.publicContactEmail && (
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{society.publicContactEmail}</span>
                </div>
              )}

              <Link
                to={`/colleges/${college?.id}/societies/${society?.id}`}
                className="block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline pt-1"
              >
                View Society Profile & Other Events →
              </Link>
            </div>
          </div>
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

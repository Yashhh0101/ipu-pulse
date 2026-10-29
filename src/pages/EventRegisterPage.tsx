import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { appStore } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { computeEventStatus, evaluateOutsiderEligibility, isUserAlreadyRegistered } from '../utils/rules';
import { EligibilityBadge } from '../components/common/EligibilityBadge';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Users,
} from 'lucide-react';

export const EventRegisterPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const { colleges } = useCollege();
  const navigate = useNavigate();

  const event = appStore.getEventById(eventId || '');

  const [userName, setUserName] = useState(user?.displayName || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [collegeName, setCollegeName] = useState(
    user?.selectedCollegeId
      ? colleges.find((c) => c.id === user.selectedCollegeId)?.name || 'Dr. Akhilesh Das Gupta Institute of Technology & Management'
      : 'Dr. Akhilesh Das Gupta Institute of Technology & Management'
  );
  const [course, setCourse] = useState(user?.course || 'B.Tech Computer Science');
  const [year, setYear] = useState(user?.year || '3rd Year');
  const [rollNumber, setRollNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [teamName, setTeamName] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedRegId, setConfirmedRegId] = useState<string | null>(null);

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <Link to="/events" className="mt-4 inline-block text-xs font-semibold text-indigo-600">
          Back to Events
        </Link>
      </div>
    );
  }

  const { isRegistrationCurrentlyOpen, registrationStatusLabel } = computeEventStatus(event);

  // Check if registration closed
  if (!isRegistrationCurrentlyOpen) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs my-8">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Registration is Closed</h2>
        <p className="text-xs text-slate-600 mt-2 mb-6">
          {registrationStatusLabel}. New applications cannot be accepted for this session.
        </p>
        <Link
          to={`/events/${event.id}`}
          className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
        >
          Return to Event Overview
        </Link>
      </div>
    );
  }

  // Check duplicate registration
  const existingRegistrations = appStore.getRegistrations();
  const currentUserId = user?.id || `anon-${userEmail.trim().toLowerCase()}`;
  const alreadyRegistered = isUserAlreadyRegistered(existingRegistrations, event.id, currentUserId);

  if (alreadyRegistered && !confirmedRegId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs my-8 space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">You Are Already Registered</h2>
        <p className="text-xs text-slate-600">
          You have already submitted a registration for <strong className="text-slate-800">{event.title}</strong>. Duplicate submissions are prevented.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/profile"
            className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            Go to My Registrations
          </Link>
          <Link
            to={`/events/${event.id}`}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
          >
            Back to Event Details
          </Link>
        </div>
      </div>
    );
  }

  // Successful submission confirmation view
  if (confirmedRegId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 my-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Registration Confirmed
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-3">{event.title}</h1>
            <p className="text-xs text-slate-600 mt-1">
              Your registration pass has been generated and recorded.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-500">Registration Pass ID:</span>
              <span className="font-mono font-bold text-indigo-700">#{confirmedRegId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-500">Participant:</span>
              <span className="font-semibold text-slate-900">{userName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-500">Institution:</span>
              <span className="font-semibold text-slate-900">{collegeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Venue Check:</span>
              <span className="font-semibold text-slate-900">Valid College ID Required</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 text-left">
            <p className="font-semibold mb-0.5">Campus Security Requirement:</p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Please present your original student ID card and this registration ID at the gate. Entry subject to college safety regulations.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/profile"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors text-center"
            >
              View in My Profile
            </Link>
            <Link
              to="/events"
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors text-center"
            >
              Discover More Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle Internal Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!userName.trim() || !userEmail.trim()) {
      setErrorMessage('Full name and email address are required.');
      return;
    }
    if (!consentChecked) {
      setErrorMessage('Please acknowledge the eligibility and venue guidelines to proceed.');
      return;
    }

    const res = appStore.registerForEvent({
      eventId: event.id,
      userId: currentUserId,
      userEmail: userEmail.trim(),
      userName: userName.trim(),
      collegeName: collegeName.trim(),
      course: course.trim(),
      year: year.trim(),
      rollNumber: rollNumber.trim(),
      phoneNumber: phoneNumber.trim(),
      teamName: teamName.trim() || undefined,
    });

    if (!res.success) {
      setErrorMessage(res.message);
    } else if (res.registration) {
      setConfirmedRegId(res.registration.id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Event Details</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Registration Form
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <EligibilityBadge type={event.eligibilityType} />
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-600 font-medium">{event.venue}</span>
          </div>
        </div>

        {/* Outsider Eligibility Notice */}
        <div className="p-5 bg-indigo-50/70 border-b border-indigo-100 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Eligibility Checklist</span>
          </div>
          <p className="text-indigo-900 leading-relaxed font-medium">
            {event.eligibilityDescription}
          </p>
          <p className="text-[11px] text-slate-600">
            Ensure your college details match your physical ID card to ensure smooth security clearance at the event.
          </p>
        </div>

        {/* Mode B: External Registration URL (e.g. Google Form) */}
        {event.registrationMode === 'external' ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <p className="font-bold text-sm text-amber-950">External Organiser Form</p>
              <p className="leading-relaxed">
                The organizing society conducts event ticketing and registrations via their official Google Form or external portal.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={event.registrationUrl || 'https://forms.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>Open Official Registration Form</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-slate-500 text-center">
                Registration details are handled directly by the society in accordance with their privacy policy.
              </p>
            </div>
          </div>
        ) : (
          /* Mode A: Internal Registration Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Yash Sharma"
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="student@ipu.ac.in"
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / Institute Name *
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. ADGITM, MAIT, BPIT, MSIT..."
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. B.Tech CSE, BBA, BCA"
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enrollment / Roll No (Optional)
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 02315602722"
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-900"
                />
              </div>
            </div>

            {/* Team name for group events */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Team Name (If registering as a team/squad)
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. BitBuilders"
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-900"
              />
            </div>

            {/* Consent checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  required
                />
                <span className="leading-relaxed">
                  I confirm that I meet the specified outsider eligibility criteria and will produce my physical college identity card for on-campus entry.
                </span>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/events/${event.id}`}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm & Submit Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

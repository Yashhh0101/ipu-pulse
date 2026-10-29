import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { appStore } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { CampusEvent, EligibilityType, EventCategory, RegistrationMode } from '../types';
import { ArrowLeft, Save, Calendar, AlertTriangle, Eye, Sparkles } from 'lucide-react';

export const EventEditorPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { colleges } = useCollege();

  const isEditing = Boolean(eventId);
  const existingEvent = isEditing ? appStore.getEventById(eventId || '') : undefined;

  const allSocieties = appStore.getSocieties();
  const userSocieties = allSocieties.filter(
    (s) => user?.managedSocietyIds?.includes(s.id) || s.id === 'ieee-adgitm'
  );
  const defaultSociety = userSocieties[0] || allSocieties[0];

  const [title, setTitle] = useState(existingEvent?.title || '');
  const [description, setDescription] = useState(existingEvent?.description || '');
  const [societyId, setSocietyId] = useState(existingEvent?.societyId || defaultSociety.id);
  const [collegeId, setCollegeId] = useState(existingEvent?.collegeId || defaultSociety.collegeId);
  const [category, setCategory] = useState<EventCategory>(existingEvent?.category || 'Coding and AI');
  const [posterUrl, setPosterUrl] = useState(
    existingEvent?.posterUrl ||
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
  );
  const [startAt, setStartAt] = useState(
    existingEvent?.startAt
      ? existingEvent.startAt.slice(0, 16)
      : new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 16)
  );
  const [endAt, setEndAt] = useState(
    existingEvent?.endAt
      ? existingEvent.endAt.slice(0, 16)
      : new Date(Date.now() + 86400000 * 6).toISOString().slice(0, 16)
  );
  const [registrationDeadline, setRegistrationDeadline] = useState(
    existingEvent?.registrationDeadline
      ? existingEvent.registrationDeadline.slice(0, 16)
      : new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 16)
  );
  const [venue, setVenue] = useState(existingEvent?.venue || 'Main Auditorium, Block B');
  const [isOnline, setIsOnline] = useState(existingEvent?.isOnline || false);
  const [isPaid, setIsPaid] = useState(existingEvent?.isPaid || false);
  const [entryFee, setEntryFee] = useState<number>(existingEvent?.entryFee || 0);
  const [eligibilityType, setEligibilityType] = useState<EligibilityType>(
    existingEvent?.eligibilityType || 'all_ipu_colleges'
  );
  const [eligibilityDescription, setEligibilityDescription] = useState(
    existingEvent?.eligibilityDescription ||
      'Open to students from all IPU colleges. Physical college ID card required at entry.'
  );
  const [registrationMode, setRegistrationMode] = useState<RegistrationMode>(
    existingEvent?.registrationMode || 'internal'
  );
  const [registrationUrl, setRegistrationUrl] = useState(existingEvent?.registrationUrl || '');
  const [registrationOpen, setRegistrationOpen] = useState(
    existingEvent !== undefined ? existingEvent.registrationOpen : true
  );

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update college when society changes
  useEffect(() => {
    const s = allSocieties.find((soc) => soc.id === societyId);
    if (s) setCollegeId(s.collegeId);
  }, [societyId, allSocieties]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!title.trim()) errors.push('Event title is required.');
    if (!description.trim()) errors.push('Event description is required.');
    if (!venue.trim()) errors.push('Event venue or stream location is required.');
    if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
      errors.push('Event end time must be after the start time.');
    }
    if (new Date(registrationDeadline).getTime() > new Date(endAt).getTime()) {
      errors.push('Registration deadline cannot be after the event conclusion.');
    }
    if (registrationMode === 'external' && !registrationUrl.trim()) {
      errors.push('External registration URL is required when external mode is selected.');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload: CampusEvent = {
      id: existingEvent?.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      societyId,
      collegeId,
      category,
      posterUrl: posterUrl.trim(),
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
      registrationDeadline: new Date(registrationDeadline).toISOString(),
      venue: venue.trim(),
      isOnline,
      isPaid,
      entryFee: isPaid ? Number(entryFee) : 0,
      eligibilityType,
      eligibilityDescription: eligibilityDescription.trim(),
      registrationMode,
      registrationUrl: registrationMode === 'external' ? registrationUrl.trim() : undefined,
      registrationOpen,
      verificationStatus: existingEvent?.verificationStatus || 'unverified_demo',
      publicationStatus: 'published',
      isFictionalDemo: true,
      createdBy: user?.id || 'admin',
      createdAt: existingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appStore.saveEvent(payload);
    navigate(`/events/${payload.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <Link
          to="/admin/society"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Society Admin</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isEditing ? 'Edit Campus Event' : 'Create & Publish Campus Event'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish clear schedules and outsider eligibility rules for all IPU students.
          </p>
        </div>

        {validationErrors.length > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs text-rose-800">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Please resolve the following before publishing:</span>
            </p>
            <ul className="list-disc pl-5 space-y-0.5">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HackNova 2026 — 36H Hackathon"
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
              required
            />
          </div>

          {/* Society & College */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organising Society *</label>
              <select
                value={societyId}
                onChange={(e) => setSocietyId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
              >
                {allSocieties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
              >
                <option value="Coding and AI">Coding and AI</option>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Dance and Music">Dance and Music</option>
                <option value="Literary">Literary</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
                <option value="Legal and Debate">Legal and Debate</option>
                <option value="Social Impact">Social Impact</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Detailed schedule, competition tracks, mentorship, swag, rules..."
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs leading-relaxed"
              required
            />
          </div>

          {/* Poster URL */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Event Poster Image URL (Unsplash or verified CDN)
            </label>
            <input
              type="url"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Starts *</label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Ends *</label>
              <input
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Registration Deadline *
              </label>
              <input
                type="datetime-local"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
                required
              />
            </div>
          </div>

          {/* Venue & Online status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Venue / Hall *</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Auditorium Block B, ADGITM"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
                required
              />
            </div>

            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-medium text-slate-700">Online / Virtual Stream</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={registrationOpen}
                  onChange={(e) => setRegistrationOpen(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-medium text-slate-700">Registration Open</span>
              </label>
            </div>
          </div>

          {/* Fee */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span className="font-semibold text-slate-800">
                Paid Event (Requires Entry Fee)
              </span>
            </label>

            {isPaid && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Entry Fee in INR (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={entryFee}
                  onChange={(e) => setEntryFee(Number(e.target.value))}
                  className="w-48 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            )}
          </div>

          {/* Section 9: Outsider Eligibility */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs">Outsider Eligibility Configuration</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Who Can Participate? *
                </label>
                <select
                  value={eligibilityType}
                  onChange={(e) => setEligibilityType(e.target.value as EligibilityType)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
                >
                  <option value="all_ipu_colleges">All IPU College Students</option>
                  <option value="open_to_outsiders">Open to Outsiders (All Colleges)</option>
                  <option value="organising_college_only">Organising College Students Only</option>
                  <option value="society_members_only">Society Members Only</option>
                  <option value="public_event">Public Event (Anyone)</option>
                  <option value="custom_eligibility">Custom Eligibility</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Eligibility Explanation for Students *
                </label>
                <input
                  type="text"
                  value={eligibilityDescription}
                  onChange={(e) => setEligibilityDescription(e.target.value)}
                  placeholder="e.g. Open to all colleges. Physical college ID card mandatory."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
                  required
                />
              </div>
            </div>
          </div>

          {/* Registration Mode */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs">Registration Method</h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="regMode"
                  checked={registrationMode === 'internal'}
                  onChange={() => setRegistrationMode('internal')}
                  className="text-indigo-600"
                />
                <span className="font-medium text-slate-800">
                  Internal IPU Pulse Registration (Instant Pass)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="regMode"
                  checked={registrationMode === 'external'}
                  onChange={() => setRegistrationMode('external')}
                  className="text-indigo-600"
                />
                <span className="font-medium text-slate-800">
                  External Google Form or Organizer Link
                </span>
              </label>
            </div>

            {registrationMode === 'external' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Registration URL *
                </label>
                <input
                  type="url"
                  value={registrationUrl}
                  onChange={(e) => setRegistrationUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600 text-xs"
                  required
                />
              </div>
            )}
          </div>

          {/* Submit Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/admin/society')}
              className="text-slate-500 hover:text-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Campus Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

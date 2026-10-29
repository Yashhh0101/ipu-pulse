import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { appStore } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/common/EventCard';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { computeEventStatus } from '../utils/rules';
import {
  Building2,
  Users,
  Calendar,
  Bookmark,
  ExternalLink,
  Mail,
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export const SocietyDetailPage: React.FC = () => {
  const { collegeId, societyId } = useParams<{ collegeId: string; societyId: string }>();
  const { savedSocieties, toggleSaveSociety } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'upcoming' | 'ongoing' | 'past' | 'membership' | 'contact'
  >('overview');

  const society = appStore.getSocietyById(societyId || '');
  const college = appStore.getCollegeById(collegeId || society?.collegeId || '');

  if (!society) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Society Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested society record does not exist or has been archived.</p>
        <Link to={`/colleges/${collegeId || 'adgitm'}/societies`} className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg">
          Back to Directory
        </Link>
      </div>
    );
  }

  const isSaved = savedSocieties.includes(society.id);
  const allEvents = appStore.getEvents().filter((e) => e.societyId === society.id);

  const now = new Date();
  const upcomingEvents = allEvents.filter((e) => computeEventStatus(e, now).status === 'upcoming');
  const ongoingEvents = allEvents.filter((e) => computeEventStatus(e, now).status === 'ongoing');
  const pastEvents = allEvents.filter((e) => computeEventStatus(e, now).status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          to={`/colleges/${college?.id || 'adgitm'}/societies`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {college?.abbreviation || 'College'} Societies</span>
        </Link>
      </div>

      {/* Society Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
              {society.logoUrl ? (
                <img
                  src={society.logoUrl}
                  alt={society.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-extrabold text-indigo-700 text-2xl">
                  {society.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {society.name}
                </h1>
                <VerificationBadge status={society.verificationStatus} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <Link
                  to={`/colleges/${college?.id}`}
                  className="font-medium text-slate-700 hover:text-indigo-600 flex items-center gap-1"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{college?.name || 'IPU College'}</span>
                </Link>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                  {society.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed pt-1">
                {society.description}
              </p>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <button
              onClick={() => toggleSaveSociety(society.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{isSaved ? 'Following Society' : 'Follow Society'}</span>
            </button>

            {society.recruitmentStatus === 'recruitment_open' && (
              <Link
                to={`/membership/${society.id}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Apply to Join</span>
              </Link>
            )}
          </div>
        </div>

        {/* Links bar if available */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          {society.officialWebsite && (
            <a
              href={society.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Official Website</span>
            </a>
          )}
          {society.publicContactEmail && (
            <div className="flex items-center gap-1 text-slate-700">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{society.publicContactEmail}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated: {new Date(society.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-1 text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'ongoing'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Ongoing ({ongoingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'past'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Past Events ({pastEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('membership')}
          className={`px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'membership'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Membership & Recruitment
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Contact & Verified Representatives
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">About {society.name}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {society.description}
              </p>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                  Focus Domain & Activities
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>Regular technical seminars, design sprints, and skill workshops.</li>
                  <li>Representing {college?.abbreviation} at inter-college fests and national championships.</li>
                  <li>Mentoring junior students in open source, competitive contests, or stage productions.</li>
                </ul>
              </div>
            </div>

            {/* Next upcoming event snippet */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Scheduled Next</h3>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View all ({upcomingEvents.length})
                </button>
              </div>
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcomingEvents.slice(0, 2).map((evt) => (
                    <EventCard key={evt.id} event={evt} />
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                  No upcoming events currently scheduled by this society.
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Recruitment card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">Recruitment Status</h4>
                {society.recruitmentStatus === 'recruitment_open' ? (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Recruiting
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                    Closed
                  </span>
                )}
              </div>

              {society.recruitmentStatus === 'recruitment_open' ? (
                <>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Applications are currently being reviewed for new student members.
                  </p>
                  {society.recruitmentDeadline && (
                    <div className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Deadline: {new Date(society.recruitmentDeadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  <Link
                    to={`/membership/${society.id}`}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Application Process</span>
                  </Link>
                </>
              ) : (
                <p className="text-xs text-slate-500">
                  This society is not actively conducting open recruitment today. Keep notifications enabled to receive an alert when forms open.
                </p>
              )}
            </div>

            {/* Verification Note */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Verification & Community Transparency</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                IPU Pulse strictly distinguishes verified society leads from unverified submissions. Notice anything out of date? Submit a quick community correction note.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Upcoming Events */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Upcoming Events Organised by {society.name}</h3>
          {upcomingEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              No upcoming events are currently scheduled by {society.name}.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Ongoing Events */}
      {activeTab === 'ongoing' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Live & Ongoing Sessions</h3>
          {ongoingEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              No events are currently taking place today from this society.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Past Events */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Past Events Archive</h3>
          {pastEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              No previous completed events archived yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Membership */}
      {activeTab === 'membership' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Membership & Induction Guidelines</h3>
            <p className="text-xs text-slate-600 mt-1">
              Joining instructions, department roles, and candidate requirements.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 text-sm">Prerequisites & Eligibility</h4>
            {society.recruitmentRequirements && society.recruitmentRequirements.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-700">
                {society.recruitmentRequirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                No specific prerequisites required. Students of all years and branches with genuine interest are welcomed to interview.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <Link
              to={`/membership/${society.id}`}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Open Official Membership Portal</span>
            </Link>
          </div>
        </div>
      )}

      {/* Tab: Contact */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-2xl">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Society Contact Information</h3>
            <p className="text-xs text-slate-600 mt-1">
              Only verified official emails and department designations are displayed to maintain privacy.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <p className="font-semibold text-slate-800">Official Society Desk</p>
              <p className="text-slate-600">
                Email: {society.publicContactEmail || 'ieee@adgitm.ac.in'}
              </p>
              <p className="text-slate-600">
                Campus: {college?.name}
              </p>
            </div>

            {/* Privacy rule notice */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
              <p className="font-semibold mb-1">Privacy Notice:</p>
              <p className="leading-relaxed">
                Contact details will be available once verified by the society. In accordance with university privacy guidelines, student phone numbers and private addresses are strictly never published or inferred.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

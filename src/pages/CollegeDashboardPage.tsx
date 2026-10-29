import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollege } from '../context/CollegeContext';
import { appStore } from '../services/store';
import { EventCard } from '../components/common/EventCard';
import { SocietyCard } from '../components/common/SocietyCard';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { filterEvents, computeEventStatus } from '../utils/rules';
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  UserPlus,
  Sparkles,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { EventCategory } from '../types';

export const CollegeDashboardPage: React.FC = () => {
  const { collegeId } = useParams<{ collegeId: string }>();
  const { colleges, openSelector, selectCollege } = useCollege();

  const currentCollege = colleges.find((c) => c.id === collegeId) || colleges[0];

  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'societies' | 'recruitment' | 'all_events'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [feeFilter, setFeeFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [registrationOpenOnly, setRegistrationOpenOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'closing_soon' | 'recently_added'>('date_asc');

  const allEvents = appStore.getEvents();
  const collegeEvents = allEvents.filter((e) => e.collegeId === currentCollege.id);
  const collegeSocieties = appStore.getSocietiesByCollege(currentCollege.id);

  // Filtered events
  const filteredEvents = filterEvents(collegeEvents, {
    query: searchQuery,
    category: selectedCategory,
    eligibilityType: selectedEligibility,
    format: formatFilter,
    fee: feeFilter,
    registrationOpenOnly,
    sortBy,
  });

  // Dynamic live vs upcoming vs recent
  const now = new Date();
  const liveEvents = collegeEvents.filter((e) => {
    const s = computeEventStatus(e, now);
    return s.status === 'ongoing';
  });
  const upcomingEvents = collegeEvents.filter((e) => {
    const s = computeEventStatus(e, now);
    return s.status === 'upcoming';
  });
  const recruitingSocieties = collegeSocieties.filter(
    (s) => s.recruitmentStatus === 'recruitment_open'
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedEligibility('all');
    setFormatFilter('all');
    setFeeFilter('all');
    setRegistrationOpenOnly(false);
    setSortBy('date_asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* College Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
              {currentCollege.abbreviation}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentCollege.name}
                </h1>
                <VerificationBadge status={currentCollege.verificationStatus} />
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                <div className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentCollege.location}</span>
                </div>
                {currentCollege.officialWebsite && (
                  <a
                    href={currentCollege.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2 max-w-2xl leading-relaxed">
                {currentCollege.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2">
            <button
              onClick={openSelector}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change College</span>
            </button>
            <Link
              to="/colleges"
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover other IPU colleges</span>
            </Link>
          </div>
        </div>

        {/* Quick metrics bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Societies</p>
            <p className="text-lg font-black text-slate-900">{collegeSocieties.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Upcoming Events</p>
            <p className="text-lg font-black text-slate-900">{upcomingEvents.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Live Ongoing</p>
            <p className="text-lg font-black text-emerald-600">{liveEvents.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Recruiting Now</p>
            <p className="text-lg font-black text-indigo-600">{recruitingSocieties.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-1 text-sm font-medium">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming Events ({upcomingEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'live'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live / Ongoing ({liveEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('societies')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'societies'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Societies ({collegeSocieties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recruitment')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'recruitment'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Recruitment Openings ({recruitingSocieties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all_events')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'all_events'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Browse All Events with Filters</span>
        </button>
      </div>

      {/* Tab: Upcoming Events */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Upcoming Events at {currentCollege.abbreviation}</h2>
              <p className="text-xs text-slate-500">Scheduled campus fests, workshops, and contests</p>
            </div>
            <button
              onClick={() => setActiveTab('all_events')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View all with filters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 text-sm">No upcoming events currently scheduled for {currentCollege.abbreviation}</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">You can explore societies or switch colleges to see events happening elsewhere in IPU.</p>
              <Link to="/events" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg">
                Explore All IPU Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Live Ongoing Events */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Live Campus Events Today</h2>
            <p className="text-xs text-slate-500">Happening right now at {currentCollege.name}</p>
          </div>

          {liveEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block mb-3" />
              <p className="font-semibold text-slate-700 text-sm">No live sessions in progress right now</p>
              <p className="text-xs text-slate-500 mt-1">Check the upcoming tab for scheduled events this week.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {liveEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Societies in this College */}
      {activeTab === 'societies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Societies in {currentCollege.abbreviation}</h2>
              <p className="text-xs text-slate-500">Student clubs and collegiate societies</p>
            </div>
            <Link
              to={`/colleges/${currentCollege.id}/societies`}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Full Society Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {collegeSocieties.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 text-sm">No verified societies registered for this college yet</p>
              <p className="text-xs text-slate-500 mt-1">Society leads can register their chapter via the Society Admin Portal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collegeSocieties.map((soc) => (
                <SocietyCard key={soc.id} society={soc} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Recruitment Opportunities */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Society Recruitment</h2>
            <p className="text-xs text-slate-500">Apply to become a core member or junior volunteer</p>
          </div>

          {recruitingSocieties.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <UserPlus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 text-sm">No active recruitment drives open at this moment</p>
              <p className="text-xs text-slate-500 mt-1">Recruitment usually opens at the beginning of each semester.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recruitingSocieties.map((soc) => (
                <SocietyCard key={soc.id} society={soc} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: All Events with Comprehensive Filters */}
      {activeTab === 'all_events' && (
        <div className="space-y-6">
          {/* Filter Controls Bar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, description, or venue..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="All">All Categories</option>
                  <option value="Coding and AI">Coding and AI</option>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Dance and Music">Dance and Music</option>
                  <option value="Literary">Literary</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Legal and Debate">Legal and Debate</option>
                  <option value="Social Impact">Social Impact</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Eligibility</label>
                <select
                  value={selectedEligibility}
                  onChange={(e) => setSelectedEligibility(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="all">All Eligibility</option>
                  <option value="outsiders_welcome">Outsiders Welcome</option>
                  <option value="all_ipu_colleges">All IPU Colleges</option>
                  <option value="organising_college_only">Host College Only</option>
                  <option value="open_to_outsiders">Open to Outsiders</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Format</label>
                <select
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="all">All Formats</option>
                  <option value="offline">Offline / On-Campus</option>
                  <option value="online">Online / Virtual</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Entry Fee</label>
                <select
                  value={feeFilter}
                  onChange={(e) => setFeeFilter(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="all">All Entry Fees</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Paid Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="date_asc">Soonest First</option>
                  <option value="closing_soon">Registration Closing Soon</option>
                  <option value="recently_added">Recently Published</option>
                  <option value="date_desc">Latest Date First</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registrationOpenOnly}
                    onChange={(e) => setRegistrationOpenOnly(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-[11px] font-medium text-slate-700">Open Only</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">
                Showing {filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'}
              </span>
              <button
                onClick={resetFilters}
                className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <Filter className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 text-sm">No events match your current filter settings</p>
              <button
                onClick={resetFilters}
                className="mt-3 px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

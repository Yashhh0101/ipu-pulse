import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCollege } from '../context/CollegeContext';
import { appStore } from '../services/store';
import { EventCard } from '../components/common/EventCard';
import { filterEvents } from '../utils/rules';
import {
  Calendar,
  Search,
  Filter,
  Sparkles,
  Building2,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { AIEventDiscoveryModal } from '../components/common/AIEventDiscoveryModal';

export const EventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { colleges } = useCollege();

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read URL params if any
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('query') || '';
  const initialCollege = searchParams.get('collegeId') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(initialCollege);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedEligibility, setSelectedEligibility] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [feeFilter, setFeeFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [registrationOpenOnly, setRegistrationOpenOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'closing_soon' | 'recently_added'>('date_asc');

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') || 'All');
    }
    if (searchParams.get('query')) {
      setSearchQuery(searchParams.get('query') || '');
    }
  }, [searchParams]);

  const allEvents = appStore.getEvents();

  const filteredEvents = filterEvents(allEvents, {
    query: searchQuery,
    collegeId: selectedCollegeId,
    category: selectedCategory,
    eligibilityType: selectedEligibility,
    format: formatFilter,
    fee: feeFilter,
    registrationOpenOnly,
    sortBy,
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCollegeId('all');
    setSelectedCategory('All');
    setSelectedEligibility('all');
    setFormatFilter('all');
    setFeeFilter('all');
    setRegistrationOpenOnly(false);
    setSortBy('date_asc');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & AI Search Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs mb-1 uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Campus Schedule & Contests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Campus Events Across IPU
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Fests, hackathons, orientations, workshops, and competitions with verified outsider eligibility.
          </p>
        </div>

        <button
          onClick={() => setAiModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Natural Language Search</span>
        </button>
      </div>

      {/* Main Filter Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, keyword, venue, or society..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900"
            />
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({filteredEvents.length} results)</span>
          </button>
        </div>

        {/* Filter Controls (Desktop and toggled on Mobile) */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs ${mobileFilterOpen ? 'block' : 'hidden sm:grid'}`}>
          {/* College Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">IPU College</label>
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">All IPU Colleges</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.abbreviation} ({c.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
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

          {/* Eligibility Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Outsider Eligibility</label>
            <select
              value={selectedEligibility}
              onChange={(e) => setSelectedEligibility(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">All Eligibility Rules</option>
              <option value="outsiders_welcome">Outsiders Welcome</option>
              <option value="all_ipu_colleges">All IPU Students</option>
              <option value="open_to_outsiders">Open to External Colleges</option>
              <option value="organising_college_only">Host College Only</option>
              <option value="society_members_only">Members Only</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Format</label>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">Online & Offline</option>
              <option value="offline">On-Campus Only</option>
              <option value="online">Virtual / Online</option>
            </select>
          </div>

          {/* Fee */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Entry Fee</label>
            <select
              value={feeFilter}
              onChange={(e) => setFeeFilter(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">Free & Paid</option>
              <option value="free">Free Events Only</option>
              <option value="paid">Paid Events Only</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sort Schedule</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="date_asc">Event Date (Soonest)</option>
              <option value="closing_soon">Registration Deadline</option>
              <option value="recently_added">Recently Published</option>
            </select>
          </div>
        </div>

        {/* Bottom filter bar count & active chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              {filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'} discovered
            </span>
            {selectedCategory !== 'All' && (
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1">
                {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
              </span>
            )}
            {selectedCollegeId !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1">
                {colleges.find((c) => c.id === selectedCollegeId)?.abbreviation}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCollegeId('all')} />
              </span>
            )}
          </div>

          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Events Results Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No events match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Try resetting your filters or clearing search terms to explore events across other IPU colleges.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}

      <AIEventDiscoveryModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
};

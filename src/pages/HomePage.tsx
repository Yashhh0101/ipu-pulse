import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCollege } from '../context/CollegeContext';
import { appStore } from '../services/store';
import { EventCard } from '../components/common/EventCard';
import { SocietyCard } from '../components/common/SocietyCard';
import {
  Compass,
  Building2,
  Calendar,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { EventCategory } from '../types';

const CATEGORIES: { label: EventCategory; icon: string; countHint?: string }[] = [
  { label: 'Coding and AI', icon: '💻' },
  { label: 'Technical', icon: '⚙️' },
  { label: 'Dance and Music', icon: '🎵' },
  { label: 'Cultural', icon: '🎭' },
  { label: 'Literary', icon: '📖' },
  { label: 'Entrepreneurship', icon: '🚀' },
  { label: 'Legal and Debate', icon: '⚖️' },
  { label: 'Social Impact', icon: '🌱' },
  { label: 'Sports', icon: '🏆' },
  { label: 'Other', icon: '✨' },
];

export const HomePage: React.FC = () => {
  const { selectedCollege, openSelector } = useCollege();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const allEvents = appStore.getEvents();
  const allSocieties = appStore.getSocieties();

  // Curate upcoming events (only upcoming & published)
  const upcomingEvents = allEvents
    .filter((e) => new Date(e.endAt).getTime() >= Date.now())
    .slice(0, 4);

  // Featured societies
  const featuredSocieties = allSocieties.slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 border-b border-slate-200 pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Campus selection pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span>Currently exploring:</span>
              <button
                onClick={openSelector}
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
              >
                {selectedCollege ? `${selectedCollege.abbreviation} (${selectedCollege.name})` : 'Choose your IPU college'}
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Your campus has a life beyond classes.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Discover fests, hackathons, orientations, workshops, and the societies shaping your
              college experience across GGSIPU colleges.
            </p>

            {/* Real Search Bar */}
            <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, societies, or topics (e.g. Hackathon, Dance, Debate)..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/events"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={`/colleges/${selectedCollege?.id || 'adgitm'}/societies`}
                className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm rounded-lg shadow-xs transition-colors"
              >
                Find Societies
              </Link>
              <button
                onClick={openSelector}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>Switch IPU College</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Discovery Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Explore by Category</h2>
            <p className="text-xs text-slate-500">Find events and clubs matching your passions</p>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              to={`/events?category=${encodeURIComponent(cat.label)}`}
              className="p-3.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 rounded-xl transition-all shadow-xs flex items-center gap-3 group"
            >
              <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700 truncate">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-50 text-indigo-600">
                <Calendar className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Upcoming Campus Events
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Curated verified schedule of fests, hackathons, and competitions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/colleges/${selectedCollege?.id || 'adgitm'}`}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              {selectedCollege?.abbreviation || 'College'} Dashboard
            </Link>
            <Link
              to="/events"
              className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Browse All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-800 text-sm">No upcoming events have been published yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Societies are currently curating schedules for the upcoming term. Check back soon or browse society recruitment.
            </p>
            <button
              onClick={openSelector}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg cursor-pointer"
            >
              Change College
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Societies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-50 text-indigo-600">
                <Users className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Featured Campus Societies
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Technical, cultural, and leadership student bodies actively driving student initiatives
            </p>
          </div>
          <Link
            to={`/colleges/${selectedCollege?.id || 'adgitm'}/societies`}
            className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Societies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSocieties.map((soc) => (
            <SocietyCard key={soc.id} society={soc} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              How IPU Pulse Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Stop hunting through scattered WhatsApp groups, dead Instagram links, and confusing posters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-black text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Select Your College</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose from 10 supported GGSIPU colleges to customize your local society feeds and campus announcements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-black text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Discover Societies & Events</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore active student organizations, upcoming fests, hackathons, and recruitments across campuses.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-black text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Check Eligibility & Register</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Confirm whether outsider students can participate, check registration deadlines, and submit your entries cleanly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Member Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md">
          <div className="max-w-2xl space-y-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Recruitment Season
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Find your people. Build your future.
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Societies are the heartbeat of college life. Apply to developer collectives, dramatics
              troupes, robotics labs, debating societies, and entrepreneurship cells recruiting new members.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/membership"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-indigo-900 font-bold text-sm rounded-xl transition-colors shadow-xs text-center"
            >
              Explore Membership Opportunities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

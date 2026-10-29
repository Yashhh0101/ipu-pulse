import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollege } from '../context/CollegeContext';
import { appStore } from '../services/store';
import { SocietyCard } from '../components/common/SocietyCard';
import {
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { EventCategory, RecruitmentStatus } from '../types';

export const MembershipPage: React.FC = () => {
  const { colleges, selectedCollegeId, selectCollege } = useCollege();
  const [filterCollegeId, setFilterCollegeId] = useState<string>(selectedCollegeId || 'all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'recruiting_now' | 'upcoming'>('recruiting_now');
  const [searchQuery, setSearchQuery] = useState('');

  const allSocieties = appStore.getSocieties();

  const filtered = allSocieties.filter((s) => {
    // College
    if (filterCollegeId !== 'all' && s.collegeId !== filterCollegeId) return false;

    // Recruitment status
    if (statusFilter === 'recruiting_now' && s.recruitmentStatus !== 'recruitment_open') {
      return false;
    }
    if (statusFilter === 'upcoming' && s.recruitmentStatus !== 'recruitment_upcoming') {
      return false;
    }

    // Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-6 sm:p-10 text-white shadow-md">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Campus Society Recruitment 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Find your people. Build your future.
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
            Joining a college society is where projects happen, leadership forms, and lifelong networks begin. Browse verified recruitment drives across all IPU colleges.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search society by name, technology, or creative domain..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900"
            />
          </div>

          {/* College Filter */}
          <select
            value={filterCollegeId}
            onChange={(e) => setFilterCollegeId(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-indigo-600"
          >
            <option value="all">All IPU Colleges</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.abbreviation} — {c.name.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Status Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setStatusFilter('recruiting_now')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'recruiting_now'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Recruiting Now (Open Forms)
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'upcoming'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Upcoming Recruitment Drives
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Societies
          </button>
        </div>
      </div>

      {/* Societies Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-slate-200">
          <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No recruitment drives match this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Try switching to 'All Societies' to view all registered chapters, or select another college.
          </p>
          <button
            onClick={() => {
              setFilterCollegeId('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((soc) => (
            <SocietyCard key={soc.id} society={soc} />
          ))}
        </div>
      )}
    </div>
  );
};

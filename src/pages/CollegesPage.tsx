import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollege } from '../context/CollegeContext';
import { appStore } from '../services/store';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { Building2, MapPin, Search, Users, Calendar, ArrowRight, ExternalLink } from 'lucide-react';

export const CollegesPage: React.FC = () => {
  const { colleges, selectCollege } = useCollege();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const allSocieties = appStore.getSocieties();
  const allEvents = appStore.getEvents();

  const filteredColleges = colleges.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.abbreviation.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  });

  const handleSelect = (collegeId: string) => {
    selectCollege(collegeId);
    navigate(`/colleges/${collegeId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs mb-1 uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Indraprastha University Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore All 10 Supported IPU Colleges
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Select any college to view its dedicated campus dashboard, societies, ongoing fests, and
          recruitment opportunities.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search college by name, acronym, or location..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs"
        />
      </div>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((col) => {
          const societyCount = allSocieties.filter((s) => s.collegeId === col.id).length;
          const eventCount = allEvents.filter((e) => e.collegeId === col.id).length;

          return (
            <div
              key={col.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-700 text-lg">
                    {col.abbreviation.substring(0, 3)}
                  </div>
                  <VerificationBadge status={col.verificationStatus} />
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors mb-1">
                  {col.name}
                </h3>
                <p className="text-xs font-semibold text-indigo-600 mb-2">
                  Acronym: {col.abbreviation}
                </p>

                <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{col.location}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {col.description}
                </p>

                {/* Counts */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg text-xs mb-4">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-semibold">{societyCount}</span>
                    <span className="text-slate-500">societies</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-semibold">{eventCount}</span>
                    <span className="text-slate-500">events</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {col.officialWebsite ? (
                  <a
                    href={col.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Website pending</span>
                )}

                <button
                  onClick={() => handleSelect(col.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <span>Select Campus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

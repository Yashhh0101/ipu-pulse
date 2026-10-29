import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollege } from '../context/CollegeContext';
import { appStore } from '../services/store';
import { SocietyCard } from '../components/common/SocietyCard';
import { filterSocieties } from '../utils/rules';
import { Users, Search, Filter, Building2, UserPlus, ArrowLeft } from 'lucide-react';
import { EventCategory } from '../types';

export const SocietyDirectoryPage: React.FC = () => {
  const { collegeId } = useParams<{ collegeId: string }>();
  const { colleges } = useCollege();
  const currentCollege = colleges.find((c) => c.id === collegeId) || colleges[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recruitingOnly, setRecruitingOnly] = useState<boolean>(false);

  const collegeSocieties = appStore.getSocietiesByCollege(currentCollege.id);

  const filteredSocieties = filterSocieties(collegeSocieties, {
    query: searchQuery,
    category: selectedCategory,
    recruitingOnly,
  });

  const categories: (EventCategory | 'All')[] = [
    'All',
    'Coding and AI',
    'Technical',
    'Cultural',
    'Dance and Music',
    'Literary',
    'Entrepreneurship',
    'Legal and Debate',
    'Social Impact',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb / Back button */}
      <div>
        <Link
          to={`/colleges/${currentCollege.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {currentCollege.abbreviation} Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs mb-1 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Campus Societies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Societies in {currentCollege.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Discover student-run technical clubs, cultural troupes, and special interest groups.
          </p>
        </div>

        <Link
          to="/membership"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors self-start md:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Membership Recruitment Drives</span>
        </Link>
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
              placeholder="Search society by name or domain..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900"
            />
          </div>

          <label className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={recruitingOnly}
              onChange={(e) => setRecruitingOnly(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <span>Recruiting Now Only</span>
          </label>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredSocieties.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-semibold text-slate-800 text-sm">No societies match this criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search query or choosing another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setRecruitingOnly(false);
            }}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSocieties.map((soc) => (
            <SocietyCard key={soc.id} society={soc} />
          ))}
        </div>
      )}
    </div>
  );
};

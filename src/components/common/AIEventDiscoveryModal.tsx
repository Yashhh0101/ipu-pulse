import React, { useState } from 'react';
import { CampusEvent } from '../../types';
import { appStore } from '../../services/store';
import { EventCard } from './EventCard';
import { Sparkles, X, Search, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AIEventDiscoveryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CampusEvent[] | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);

  if (!isOpen) return null;

  const samplePrompts = [
    'Show coding events where students from other colleges are allowed',
    'Cultural and dance competitions in ADGITM',
    'Free technical workshops this month',
    'Hackathons open to all IPU students',
  ];

  const handleSearch = (searchQuery: string) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    setIsLoading(true);
    setQuery(searchQuery);

    // Natural Language Query Semantic Matching against the real DB
    setTimeout(() => {
      const allEvents = appStore.getEvents();
      let matched = [...allEvents];
      const appliedFilters: string[] = [];

      // Category matching
      if (q.includes('cod') || q.includes('hack') || q.includes('programm')) {
        matched = matched.filter((e) => e.category === 'Coding and AI' || e.category === 'Technical');
        appliedFilters.push('Category: Coding & Technical');
      } else if (q.includes('danc') || q.includes('music') || q.includes('sing')) {
        matched = matched.filter((e) => e.category === 'Dance and Music' || e.category === 'Cultural');
        appliedFilters.push('Category: Dance & Music');
      } else if (q.includes('debat') || q.includes('mun') || q.includes('literary') || q.includes('writ')) {
        matched = matched.filter((e) => e.category === 'Literary' || e.category === 'Legal and Debate');
        appliedFilters.push('Category: Literary & Debate');
      } else if (q.includes('startup') || q.includes('pitch') || q.includes('entrepreneur')) {
        matched = matched.filter((e) => e.category === 'Entrepreneurship');
        appliedFilters.push('Category: Entrepreneurship');
      }

      // Outsider eligibility matching
      if (
        q.includes('other college') ||
        q.includes('outsider') ||
        q.includes('all student') ||
        q.includes('open to all') ||
        q.includes('allowed')
      ) {
        const outsiderFriendly = [
          'open_to_outsiders',
          'all_college_students',
          'all_ipu_colleges',
          'public_event',
        ];
        matched = matched.filter((e) => outsiderFriendly.includes(e.eligibilityType));
        appliedFilters.push('Eligibility: Outsiders & External Students Welcome');
      }

      // College matching
      if (q.includes('adgitm')) {
        matched = matched.filter((e) => e.collegeId === 'adgitm');
        appliedFilters.push('College: ADGITM');
      } else if (q.includes('mait')) {
        matched = matched.filter((e) => e.collegeId === 'mait');
        appliedFilters.push('College: MAIT');
      } else if (q.includes('msit')) {
        matched = matched.filter((e) => e.collegeId === 'msit');
        appliedFilters.push('College: MSIT');
      }

      // Free events
      if (q.includes('free') || q.includes('zero fee')) {
        matched = matched.filter((e) => !e.isPaid);
        appliedFilters.push('Entry: Free');
      }

      setResults(matched);
      setInterpretation(
        appliedFilters.length > 0
          ? `Discovered ${matched.length} event${matched.length === 1 ? '' : 's'} matching: ${appliedFilters.join(' • ')}`
          : `Found ${matched.length} events from existing listings.`
      );
      setIsLoading(false);
    }, 300);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-indigo-50/60 to-purple-50/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">AI Campus Event Discovery</h3>
              <p className="text-xs text-slate-600">
                Ask in natural language. Only returns real events verified from the database without hallucinations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close AI discovery"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-5 border-b border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Show coding events next weekend where students from other colleges are allowed..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white text-slate-900"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Sample Prompts */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400">Suggestions:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSearch(p)}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="p-5 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-16 text-center text-slate-500">
              <Sparkles className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-2" />
              <p className="text-sm font-medium">Filtering campus events against eligibility criteria...</p>
            </div>
          ) : results !== null ? (
            <div>
              {interpretation && (
                <div className="mb-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-900 font-medium">
                  {interpretation}
                </div>
              )}

              {results.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p className="font-semibold text-slate-700 mb-1">No matching events found</p>
                  <p className="text-xs max-w-md mx-auto">
                    No currently published events in the database meet all of these criteria. Try broadening your query or selecting all colleges.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((evt) => (
                    <EventCard key={evt.id} event={evt} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              Type your campus requirements above to discover events tailored to your college and eligibility.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

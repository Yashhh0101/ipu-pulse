import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Search, MapPin, Check, X, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CollegeSelectorModal: React.FC = () => {
  const { colleges, selectedCollegeId, selectCollege, isSelectorOpen, closeSelector } = useCollege();
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelectedId, setTempSelectedId] = useState(selectedCollegeId);
  const navigate = useNavigate();

  if (!isSelectorOpen) return null;

  const filteredColleges = colleges.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.abbreviation.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  });

  const handleConfirm = () => {
    selectCollege(tempSelectedId);
    closeSelector();
    navigate(`/colleges/${tempSelectedId}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="college-modal-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Building2 className="w-5 h-5" />
              </span>
              <h2 id="college-modal-heading" className="text-xl font-bold text-slate-900">
                Which college are you from?
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Choose your college to discover societies and events around you.
            </p>
          </div>
          <button
            onClick={closeSelector}
            aria-label="Close college selector"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by full college name or acronym (e.g. ADGITM, MAIT, BPIT)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-900"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* List of colleges */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {filteredColleges.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching IPU college found for "{searchTerm}".
            </div>
          ) : (
            filteredColleges.map((col) => {
              const isSelected = col.id === tempSelectedId;
              return (
                <div
                  key={col.id}
                  onClick={() => setTempSelectedId(col.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-left ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-slate-900 text-sm">
                        {col.abbreviation}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-700 font-medium line-clamp-1">
                        {col.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{col.location}</span>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={closeSelector}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Skip for now
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleConfirm}
              className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Continue to Campus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

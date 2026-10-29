import React, { useState } from 'react';
import { Society } from '../../types';
import { appStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { VerificationBadge } from './VerificationBadge';
import { Bookmark, Calendar, ArrowRight, UserPlus, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReportModal } from './ReportModal';

interface Props {
  society: Society;
}

export const SocietyCard: React.FC<Props> = ({ society }) => {
  const { savedSocieties, toggleSaveSociety } = useAuth();
  const [reportOpen, setReportOpen] = useState(false);
  const college = appStore.getCollegeById(society.collegeId);
  const isSaved = savedSocieties.includes(society.id);

  // Calculate actual number of upcoming events from real records
  const allEvents = appStore.getEvents();
  const upcomingCount = allEvents.filter(
    (e) => e.societyId === society.id && new Date(e.endAt).getTime() >= Date.now()
  ).length;

  const getRecruitmentBadge = () => {
    switch (society.recruitmentStatus) {
      case 'recruitment_open':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserPlus className="w-3 h-3 text-emerald-600" />
            <span>Recruiting Now</span>
          </span>
        );
      case 'recruitment_upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span>Recruitment Soon</span>
          </span>
        );
      case 'recruitment_closed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
            Recruitment Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 overflow-hidden shrink-0 flex items-center justify-center">
              {society.logoUrl ? (
                <img
                  src={society.logoUrl}
                  alt={society.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <span className="font-bold text-indigo-700 text-lg">
                  {society.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <Link
                to={`/colleges/${society.collegeId}/societies/${society.id}`}
                className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base"
              >
                {society.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{college?.abbreviation || 'IPU'}</span>
                <span>•</span>
                <span className="text-slate-600 font-medium">{society.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleSaveSociety(society.id)}
              aria-label={isSaved ? 'Unfollow society' : 'Follow society'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => setReportOpen(true)}
              title="Report inaccurate society info"
              aria-label="Report inaccurate society info"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Verification Status */}
        <div className="mb-2.5">
          <VerificationBadge status={society.verificationStatus} />
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {society.description}
        </p>
      </div>

      {/* Footer info: Upcoming events + recruitment status + CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {getRecruitmentBadge()}
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{upcomingCount} upcoming</span>
          </span>
        </div>

        <Link
          to={`/colleges/${society.collegeId}/societies/${society.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="society"
        targetId={society.id}
        targetTitle={society.name}
      />
    </div>
  );
};

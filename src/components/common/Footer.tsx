import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Mail, AlertTriangle, Building2, ExternalLink } from 'lucide-react';
import { ReportModal } from './ReportModal';
import { useCollege } from '../../context/CollegeContext';

export const Footer: React.FC = () => {
  const [reportOpen, setReportOpen] = useState(false);
  const { openSelector } = useCollege();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                IPU <span className="text-indigo-400">Pulse</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Every College. Every Society. Every Opportunity. The unified campus discovery platform
              empowering students across Guru Gobind Singh Indraprastha University (GGSIPU) colleges to
              explore societies, verify outsider event eligibility, and apply for recruitment.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Independent student discovery ecosystem</span>
            </div>
          </div>

          {/* Column: Discover */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  All Campus Events
                </Link>
              </li>
              <li>
                <button
                  onClick={openSelector}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Choose Your College
                </button>
              </li>
              <li>
                <Link to="/colleges" className="hover:text-white transition-colors">
                  10 Supported Colleges
                </Link>
              </li>
              <li>
                <Link to="/membership" className="hover:text-white transition-colors">
                  Society Recruitment
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Portals & Roles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/society" className="hover:text-white transition-colors">
                  Society Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/platform" className="hover:text-white transition-colors">
                  Platform Moderation
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setReportOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Inaccurate Data</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Legal & Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Transparency</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Use & Verification
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-slate-500 leading-normal">
                Contact & Support:
                <br />
                <a
                  href="mailto:support@ipupulse.in"
                  className="text-slate-400 hover:text-indigo-400 flex items-center gap-1 mt-0.5"
                >
                  <Mail className="w-3 h-3" />
                  <span>support@ipupulse.in</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer Notice */}
        <div className="pt-8 text-xs text-slate-400 space-y-2">
          <p className="leading-relaxed">
            <strong className="text-slate-300">Disclaimer:</strong> IPU Pulse is an open, independent
            student information platform. Event schedules, fees, venues, and outsider eligibility
            criteria are managed and updated by the respective student societies and college organisers.
            IPU Pulse does not claim official affiliation or endorsement from Guru Gobind Singh
            Indraprastha University (GGSIPU) or any affiliated college unless explicitly stated.
            Demonstration records are labelled as prototypes.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 pt-2 border-t border-slate-800 text-[11px]">
            <p>© {new Date().getFullYear()} IPU Pulse. Engineered for Delhi NCR student communities.</p>
            <p className="mt-1 sm:mt-0">Verification rules enforced • Safe prototype mode active</p>
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="event"
        targetId="general-feedback"
        targetTitle="General Platform Record Correction"
      />
    </footer>
  );
};

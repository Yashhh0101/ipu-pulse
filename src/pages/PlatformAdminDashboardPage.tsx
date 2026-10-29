import React, { useState } from 'react';
import { appStore, DEMO_USERS } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { College, Society, CampusEvent, UserReport } from '../types';
import { VerificationBadge } from '../components/common/VerificationBadge';
import {
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Flag,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlatformAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'societies' | 'colleges' | 'reports'>('overview');

  const colleges = appStore.getColleges();
  const societies = appStore.getSocieties();
  const events = appStore.getEvents();
  const registrations = appStore.getRegistrations();
  const reports = appStore.getReports();

  // Metrics from real DB
  const metrics = {
    totalUsers: DEMO_USERS.length,
    activeColleges: colleges.filter((c) => c.isActive).length,
    totalSocieties: societies.length,
    upcomingEvents: events.filter((e) => new Date(e.endAt).getTime() >= Date.now()).length,
    totalRegistrations: registrations.length,
    openReports: reports.filter((r) => r.status === 'open').length,
  };

  const handleVerifyEvent = (id: string, status: 'verified' | 'unverified_demo') => {
    appStore.updateEventVerification(id, status);
  };

  const handleVerifySociety = (id: string, status: 'verified' | 'unverified_demo') => {
    appStore.updateSocietyVerification(id, status);
  };

  const handleVerifyCollege = (id: string, status: 'verified' | 'unverified_demo') => {
    appStore.updateCollegeVerification(id, status);
  };

  const handleUpdateReport = (id: string, status: UserReport['status']) => {
    appStore.updateReportStatus(id, status);
  };

  const handleResetDemoData = () => {
    if (confirm('Reset prototype state to initial demonstration dataset? This will clear test registrations.')) {
      appStore.resetToFactoryDemo();
      alert('Demo data restored successfully.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Platform Admin Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Indraprastha Platform Moderation
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Platform Admin Console
              </h1>
              <p className="text-xs text-slate-500">
                Oversee official college verifications, society credentials, event approval, and community reports.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemoData}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset prototype store"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Prototype Data</span>
            </button>
          </div>
        </div>

        {/* Real Live Metrics Grid (from DB) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Active Colleges</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{metrics.activeColleges}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Societies Listed</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{metrics.totalSocieties}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Upcoming Events</span>
            <p className="text-lg font-black text-indigo-600 mt-0.5">{metrics.upcomingEvents}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Total Registrations</span>
            <p className="text-lg font-black text-emerald-600 mt-0.5">{metrics.totalRegistrations}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Open Reports</span>
            <p className="text-lg font-black text-amber-600 mt-0.5">{metrics.openReports}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">User Accounts</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{metrics.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-1 text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Overview & Reports ({metrics.openReports})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'events'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Verify Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('societies')}
          className={`px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'societies'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Verify Societies ({societies.length})
        </button>
        <button
          onClick={() => setActiveTab('colleges')}
          className={`px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'colleges'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          10 Colleges Directory
        </button>
      </div>

      {/* Tab: Overview & Reports */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Community Corrections & Feedback</h2>
              <p className="text-xs text-slate-500">
                User reports regarding dates, outsider eligibility, or broken links
              </p>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No open reports or flags</p>
              <p className="text-slate-400 mt-0.5">All community records are in good standing.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        {rep.reason}
                      </span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded ${
                          rep.status === 'open'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {rep.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">Target: {rep.targetTitle}</p>
                    <p className="text-slate-600">"{rep.description}"</p>
                    <p className="text-[11px] text-slate-400">
                      Reported by: {rep.reportedBy} • {new Date(rep.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rep.status !== 'resolved' ? (
                      <button
                        onClick={() => handleUpdateReport(rep.id, 'resolved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Events Moderation */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Campus Events Review</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Event</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">College</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Moderator Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/70">
                      <td className="p-4 font-semibold text-slate-900 max-w-xs">
                        <Link to={`/events/${evt.id}`} className="hover:text-indigo-600 line-clamp-1">
                          {evt.title}
                        </Link>
                      </td>
                      <td className="p-4">{evt.category}</td>
                      <td className="p-4 uppercase text-slate-600 font-semibold">{evt.collegeId}</td>
                      <td className="p-4">
                        <VerificationBadge status={evt.verificationStatus} isFictionalDemo={evt.isFictionalDemo} />
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {evt.verificationStatus === 'verified' ? (
                          <button
                            onClick={() => handleVerifyEvent(evt.id, 'unverified_demo')}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer"
                          >
                            Mark Demo
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyEvent(evt.id, 'verified')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
                          >
                            Approve Verified
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Societies Moderation */}
      {activeTab === 'societies' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Societies Directory Review</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Society Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">College</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderator Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {societies.map((soc) => (
                    <tr key={soc.id} className="hover:bg-slate-50/70">
                      <td className="p-4 font-semibold text-slate-900">
                        <Link to={`/colleges/${soc.collegeId}/societies/${soc.id}`} className="hover:text-indigo-600">
                          {soc.name}
                        </Link>
                      </td>
                      <td className="p-4">{soc.category}</td>
                      <td className="p-4 uppercase font-semibold text-slate-600">{soc.collegeId}</td>
                      <td className="p-4">
                        <VerificationBadge status={soc.verificationStatus} />
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {soc.verificationStatus === 'verified' ? (
                          <button
                            onClick={() => handleVerifySociety(soc.id, 'unverified_demo')}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer"
                          >
                            Mark Demo
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifySociety(soc.id, 'verified')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
                          >
                            Verify Official
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Colleges */}
      {activeTab === 'colleges' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Supported 10 IPU Colleges Status</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Acronym</th>
                    <th className="p-4">Full Institution Name</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderator Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {colleges.map((col) => (
                    <tr key={col.id} className="hover:bg-slate-50/70">
                      <td className="p-4 font-bold text-indigo-700">{col.abbreviation}</td>
                      <td className="p-4 font-semibold text-slate-900">{col.name}</td>
                      <td className="p-4 text-slate-600">{col.location}</td>
                      <td className="p-4">
                        <VerificationBadge status={col.verificationStatus} />
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {col.verificationStatus === 'verified' ? (
                          <button
                            onClick={() => handleVerifyCollege(col.id, 'unverified_demo')}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer"
                          >
                            Set Demo
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyCollege(col.id, 'verified')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
                          >
                            Set Verified
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

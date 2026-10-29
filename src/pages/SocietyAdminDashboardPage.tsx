import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appStore } from '../services/store';
import { CampusEvent, EventRegistration, Society } from '../types';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { EventStatusBadge } from '../components/common/EventStatusBadge';
import { computeEventStatus } from '../utils/rules';
import {
  Shield,
  Plus,
  Calendar,
  Users,
  Download,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const SocietyAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Society Admin can manage their assigned societies (default: ieee-adgitm or first available)
  const allSocieties = appStore.getSocieties();
  const managedSocieties = allSocieties.filter(
    (s) => user?.managedSocietyIds?.includes(s.id) || s.id === 'ieee-adgitm'
  );
  const currentSociety = managedSocieties[0] || allSocieties[0];

  const [activeTab, setActiveTab] = useState<'events' | 'registrations' | 'recruitment'>('events');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');

  const allEvents = appStore.getEvents();
  const societyEvents = allEvents.filter((e) => e.societyId === currentSociety.id);
  const allRegistrations = appStore.getRegistrations();

  const filteredRegistrations = allRegistrations.filter((r) => {
    if (selectedEventId === 'all') {
      return societyEvents.some((e) => e.id === r.eventId);
    }
    return r.eventId === selectedEventId;
  });

  const handleToggleRegistration = (eventId: string, currentOpen: boolean) => {
    appStore.toggleEventRegistration(eventId, !currentOpen);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      appStore.deleteEvent(eventId);
    }
  };

  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }
    const headers = ['Registration ID', 'Event ID', 'Name', 'Email', 'College', 'Course', 'Year', 'Status', 'Date'];
    const rows = filteredRegistrations.map((r) => [
      r.id,
      r.eventId,
      r.userName,
      r.userEmail,
      r.collegeName,
      r.course || '',
      r.year || '',
      r.status,
      new Date(r.submittedAt).toISOString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `registrations_${currentSociety.id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateRecruitmentStatus = (status: Society['recruitmentStatus']) => {
    appStore.saveSociety({
      ...currentSociety,
      recruitmentStatus: status,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Society Representative Console
                </span>
                <VerificationBadge status={currentSociety.verificationStatus} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentSociety.name}
              </h1>
              <p className="text-xs text-slate-500">
                Manage your campus events, verify registrations, and control recruitment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/society/events/new"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold text-[10px] uppercase">Total Events</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{societyEvents.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold text-[10px] uppercase">Total Registrations</span>
            <p className="text-lg font-black text-indigo-600 mt-0.5">{filteredRegistrations.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold text-[10px] uppercase">Recruitment Status</span>
            <p className="text-xs font-bold text-emerald-700 capitalize mt-1.5">
              {currentSociety.recruitmentStatus.replace('_', ' ')}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold text-[10px] uppercase">Security Level</span>
            <p className="text-xs font-bold text-slate-700 mt-1.5">Scope Isolated</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-1 text-sm font-medium">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'events'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Manage Events ({societyEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'registrations'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Event Registrations ({filteredRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recruitment')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'recruitment'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Recruitment Settings</span>
        </button>
      </div>

      {/* Tab: Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Events Managed by {currentSociety.name}</h2>
            <Link
              to="/admin/society/events/new"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </Link>
          </div>

          {societyEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 text-sm">No events created yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Publish your upcoming fest, hackathon, or orientation to start accepting registrations.
              </p>
              <Link
                to="/admin/society/events/new"
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg inline-block"
              >
                Create Event Now
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Event Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Event Date</th>
                      <th className="p-4">Registration</th>
                      <th className="p-4">Eligibility</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {societyEvents.map((evt) => {
                      const { status, isRegistrationCurrentlyOpen } = computeEventStatus(evt);
                      return (
                        <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4 font-semibold text-slate-900 max-w-xs">
                            <Link to={`/events/${evt.id}`} className="hover:text-indigo-600 line-clamp-1">
                              {evt.title}
                            </Link>
                            <span className="text-[10px] text-slate-400">ID: {evt.id}</span>
                          </td>
                          <td className="p-4">{evt.category}</td>
                          <td className="p-4 text-slate-600 whitespace-nowrap">
                            {new Date(evt.startAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleRegistration(evt.id, evt.registrationOpen)}
                              className="flex items-center gap-1.5 font-medium cursor-pointer"
                              title="Toggle registration open/closed"
                            >
                              {evt.registrationOpen ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <ToggleRight className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Open</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                                  <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Closed</span>
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="p-4">
                            <span className="text-[11px] font-medium text-slate-700">
                              {evt.eligibilityType.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                to={`/admin/society/events/${evt.id}/edit`}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 rounded hover:bg-slate-100"
                                title="Edit Event"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 cursor-pointer"
                                title="Delete Event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Registrations Table */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900">Event Registrations</h2>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                <option value="all">All Events ({filteredRegistrations.length})</option>
                {societyEvents.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV (Authorised)</span>
            </button>
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              No registrations recorded for this selection yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Pass ID</th>
                      <th className="p-4">Participant</th>
                      <th className="p-4">Institution</th>
                      <th className="p-4">Course & Year</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/70">
                        <td className="p-4 font-mono font-bold text-indigo-700">#{reg.id}</td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-900">{reg.userName}</p>
                          <p className="text-[11px] text-slate-500">{reg.userEmail}</p>
                        </td>
                        <td className="p-4 text-slate-800">{reg.collegeName}</td>
                        <td className="p-4 text-slate-600">
                          {reg.course || 'N/A'} • {reg.year || ''}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              reg.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {reg.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(reg.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Recruitment Settings */}
      {activeTab === 'recruitment' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-xl space-y-6 shadow-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recruitment Controls</h3>
            <p className="text-xs text-slate-500">
              Configure open admissions or external Google Form links for recruitment.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Recruitment Status
              </label>
              <select
                value={currentSociety.recruitmentStatus}
                onChange={(e) => handleUpdateRecruitmentStatus(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
              >
                <option value="recruitment_open">Recruitment Open</option>
                <option value="recruitment_upcoming">Recruitment Upcoming</option>
                <option value="recruitment_closed">Recruitment Closed</option>
                <option value="not_recruiting">Not Currently Recruiting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Google Form URL (Optional)
              </label>
              <input
                type="url"
                value={currentSociety.membershipFormUrl || ''}
                onChange={(e) =>
                  appStore.saveSociety({
                    ...currentSociety,
                    membershipFormUrl: e.target.value,
                  })
                }
                placeholder="https://docs.google.com/forms/d/..."
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Leave blank to allow students to submit applications directly via IPU Pulse internal review.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

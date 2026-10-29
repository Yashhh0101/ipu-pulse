import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { appStore } from '../services/store';
import { EventCard } from '../components/common/EventCard';
import { SocietyCard } from '../components/common/SocietyCard';
import {
  User,
  Calendar,
  Bookmark,
  Users,
  FileText,
  Settings,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
  Shield,
  Edit2,
  Check,
} from 'lucide-react';
import { EventCategory } from '../types';

export const UserProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { colleges } = useCollege();

  const [activeTab, setActiveTab] = useState<'registrations' | 'saved_events' | 'saved_societies' | 'memberships' | 'settings'>('registrations');

  // Edit profile states
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [course, setCourse] = useState(user?.course || 'B.Tech Computer Science');
  const [year, setYear] = useState(user?.year || '3rd Year');
  const [selectedCollegeId, setSelectedCollegeId] = useState(user?.selectedCollegeId || 'adgitm');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please Sign In</h2>
        <p className="text-xs text-slate-500">
          You need to be logged in to view your registrations and profile.
        </p>
        <Link
          to="/login"
          className="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg inline-block"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const allEvents = appStore.getEvents();
  const allSocieties = appStore.getSocieties();

  // User registrations
  const userRegistrations = appStore.getUserRegistrations(user.id);
  // Saved events
  const savedEventsList = allEvents.filter((e) => appStore.getSavedEventIds().includes(e.id));
  // Saved societies
  const savedSocietiesList = allSocieties.filter((s) => appStore.getSavedSocietyIds().includes(s.id));
  // Membership applications
  const userApplications = appStore.getUserMembershipApplications(user.id);

  const college = colleges.find((c) => c.id === user.selectedCollegeId) || colleges[0];

  const handleCancelRegistration = (regId: string) => {
    if (confirm('Are you sure you want to cancel this event registration?')) {
      appStore.updateRegistrationStatus(regId, 'cancelled');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      course,
      year,
      selectedCollegeId,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              {user.displayName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {user.displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 capitalize">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                <span className="font-medium text-slate-800">{college?.name}</span>
                <span>•</span>
                <span>{user.course || 'B.Tech'}</span>
                <span>•</span>
                <span>{user.year || '3rd Year'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.role === 'society_admin' && (
              <Link
                to="/admin/society"
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Society Portal</span>
              </Link>
            )}
            {user.role === 'platform_admin' && (
              <Link
                to="/admin/platform"
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Platform Console</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Registered Events</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{userRegistrations.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Saved Events</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{savedEventsList.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Followed Societies</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{savedSocietiesList.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Society Applications</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{userApplications.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-1 text-sm font-medium">
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'registrations'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Registrations ({userRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved_events')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'saved_events'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Events ({savedEventsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved_societies')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'saved_societies'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Followed Societies ({savedSocietiesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('memberships')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'memberships'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Society Applications ({userApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Tab 1: My Registrations */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Registered Events & Passes</h2>
            <Link to="/events" className="text-xs font-semibold text-indigo-600 hover:underline">
              Browse More Events
            </Link>
          </div>

          {userRegistrations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 text-sm">No registrations yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Explore upcoming hackathons, workshops, and competitions to secure your pass.
              </p>
              <Link to="/events" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg">
                Explore Events
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userRegistrations.map((reg) => {
                const event = appStore.getEventById(reg.eventId);
                const regCollege = colleges.find((c) => c.id === event?.collegeId);

                return (
                  <div
                    key={reg.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          #{reg.id}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            reg.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : reg.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {reg.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          Booked: {new Date(reg.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base">
                        {event?.title || 'Campus Event'}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {regCollege?.name} • Venue: {event?.venue}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {event && (
                        <Link
                          to={`/events/${event.id}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                        >
                          View Details
                        </Link>
                      )}
                      {reg.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelRegistration(reg.id)}
                          className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          Cancel Pass
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Events */}
      {activeTab === 'saved_events' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Saved Events</h2>
          {savedEventsList.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              You haven't bookmarked any events yet. Click the bookmark icon on any event card to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedEventsList.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Followed Societies */}
      {activeTab === 'saved_societies' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Followed Societies</h2>
          {savedSocietiesList.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              You aren't following any societies yet. Follow your favourite clubs to track their events.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSocietiesList.map((soc) => (
                <SocietyCard key={soc.id} society={soc} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Membership Applications */}
      {activeTab === 'memberships' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Submitted Society Applications</h2>
          {userApplications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              You haven't submitted any internal society applications yet.
            </div>
          ) : (
            <div className="space-y-3">
              {userApplications.map((app) => {
                const society = appStore.getSocietyById(app.societyId);
                return (
                  <div
                    key={app.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {society?.name || 'Society'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 capitalize">
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Statement: "{app.whyJoin.substring(0, 80)}..."
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Link
                      to={`/colleges/${app.collegeId}/societies/${app.societyId}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg shrink-0"
                    >
                      View Society
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Settings / Edit Profile */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-xl space-y-4 shadow-xs"
        >
          <h3 className="font-bold text-slate-900 text-base">Edit Profile Information</h3>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Affiliated IPU College
            </label>
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.abbreviation} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="B.Tech CSE"
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

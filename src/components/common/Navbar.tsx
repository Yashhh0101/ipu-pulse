import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCollege } from '../../context/CollegeContext';
import {
  Compass,
  Building2,
  Calendar,
  Users,
  UserPlus,
  Shield,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { AIEventDiscoveryModal } from './AIEventDiscoveryModal';

export const Navbar: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { selectedCollege, openSelector } = useCollege();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-xs group-hover:bg-indigo-700 transition-colors">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                    IPU <span className="text-indigo-600">Pulse</span>
                  </span>
                  <span className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-1">
                    Campus Discovery
                  </span>
                </div>
              </Link>

              {/* College Selector Pill in Navbar */}
              <button
                onClick={openSelector}
                aria-label="Select college"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50/50 text-xs text-slate-700 font-medium transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="font-semibold text-slate-900">
                  {selectedCollege?.abbreviation || 'Select College'}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500 truncate max-w-[130px]">
                  {selectedCollege ? selectedCollege.location.split(',')[0] : 'Choose campus'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <NavLink to="/" end className={navItemClass}>
                Home
              </NavLink>
              <NavLink to="/events" className={navItemClass}>
                Explore Events
              </NavLink>
              <NavLink
                to={`/colleges/${selectedCollege?.id || 'adgitm'}/societies`}
                className={navItemClass}
              >
                Societies
              </NavLink>
              <NavLink to="/membership" className={navItemClass}>
                Become a Member
              </NavLink>
              <NavLink to="/colleges" className={navItemClass}>
                All Colleges
              </NavLink>
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2.5">
              {/* Natural Language AI Discovery Button */}
              <button
                onClick={() => setAiModalOpen(true)}
                title="AI Event Discovery"
                aria-label="Natural Language Event Search"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Search</span>
              </button>

              {/* Test Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  title="Switch Role for prototype testing"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="capitalize">{user?.role ? user.role.replace('_', ' ') : 'Guest'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {roleSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50 text-xs">
                    <p className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role (Demo Mode)
                    </p>
                    <button
                      onClick={() => {
                        switchRole('student');
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                        user?.role === 'student' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>Student (Yash)</span>
                      {user?.role === 'student' && <span className="text-[10px] bg-indigo-200 px-1.5 py-0.5 rounded">Active</span>}
                    </button>
                    <button
                      onClick={() => {
                        switchRole('society_admin');
                        setRoleSwitcherOpen(false);
                        navigate('/admin/society');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                        user?.role === 'society_admin' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>Society Admin (Aarav)</span>
                      {user?.role === 'society_admin' && <span className="text-[10px] bg-indigo-200 px-1.5 py-0.5 rounded">Active</span>}
                    </button>
                    <button
                      onClick={() => {
                        switchRole('platform_admin');
                        setRoleSwitcherOpen(false);
                        navigate('/admin/platform');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                        user?.role === 'platform_admin' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>Platform Admin</span>
                      {user?.role === 'platform_admin' && <span className="text-[10px] bg-indigo-200 px-1.5 py-0.5 rounded">Active</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* User Dropdown or Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-label="User profile menu"
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                      {user.displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-900 truncate">{user.displayName}</p>
                        <p className="text-slate-500 truncate text-[11px]">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Dashboard & Registrations</span>
                      </Link>

                      {user.role === 'society_admin' && (
                        <Link
                          to="/admin/society"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-indigo-600 hover:bg-indigo-50 font-medium"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Society Admin Portal</span>
                        </Link>
                      )}

                      {user.role === 'platform_admin' && (
                        <Link
                          to="/admin/platform"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-indigo-600 hover:bg-indigo-50 font-medium"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Platform Admin Console</span>
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <button
              onClick={() => {
                openSelector();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 font-medium"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Selected: {selectedCollege?.name || 'Choose College'}</span>
              </div>
              <span className="text-indigo-600 font-bold">Change</span>
            </button>

            <nav className="flex flex-col space-y-1 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Home</span>
              </Link>
              <Link
                to="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Explore Events</span>
              </Link>
              <Link
                to={`/colleges/${selectedCollege?.id || 'adgitm'}/societies`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>Societies</span>
              </Link>
              <Link
                to="/membership"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
              >
                <UserPlus className="w-4 h-4 text-slate-400" />
                <span>Become a Member</span>
              </Link>
              <Link
                to="/colleges"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>All 10 IPU Colleges</span>
              </Link>
              <button
                onClick={() => {
                  setAiModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 flex items-center gap-2.5 font-semibold text-xs"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Natural Language Event Search</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      <AIEventDiscoveryModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </>
  );
};

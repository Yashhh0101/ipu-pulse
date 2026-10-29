import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { appStore } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { VerificationBadge } from '../components/common/VerificationBadge';
import {
  UserPlus,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  Building2,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const MembershipDetailPage: React.FC = () => {
  const { societyId } = useParams<{ societyId: string }>();
  const { user } = useAuth();

  const society = appStore.getSocietyById(societyId || '');
  const college = appStore.getCollegeById(society?.collegeId || '');

  const [userName, setUserName] = useState(user?.displayName || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [collegeName, setCollegeName] = useState(college?.name || 'ADGITM');
  const [course, setCourse] = useState(user?.course || 'B.Tech CSE');
  const [year, setYear] = useState(user?.year || '2nd Year');
  const [whyJoin, setWhyJoin] = useState('');
  const [priorExperience, setPriorExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!society) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Society Not Found</h2>
        <Link to="/membership" className="mt-4 inline-block text-xs font-semibold text-indigo-600">
          Back to Membership Directory
        </Link>
      </div>
    );
  }

  // Check if current user already submitted
  const currentUserId = user?.id || `anon-${userEmail.trim().toLowerCase()}`;
  const existingApp = appStore
    .getMembershipApplications()
    .find((a) => a.societyId === society.id && a.userId === currentUserId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!userName.trim() || !userEmail.trim() || !whyJoin.trim()) {
      setErrorMessage('Please fill in your name, email, and reason for joining.');
      return;
    }

    const res = appStore.submitMembershipApplication({
      societyId: society.id,
      collegeId: society.collegeId,
      userId: currentUserId,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      collegeName: collegeName.trim(),
      course: course.trim(),
      year: year.trim(),
      whyJoin: whyJoin.trim(),
      priorExperience: priorExperience.trim() || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
    });

    if (!res.success) {
      setErrorMessage(res.message);
    } else if (res.application) {
      setSubmittedAppId(res.application.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          to="/membership"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Membership Directory</span>
        </Link>
      </div>

      {/* Society Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-700 text-xl shrink-0">
              {society.logoUrl ? (
                <img src={society.logoUrl} alt={society.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                society.name.substring(0, 2).toUpperCase()
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {society.name}
                </h1>
                <VerificationBadge status={society.verificationStatus} />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {college?.name} • {society.category}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {society.recruitmentStatus === 'recruitment_open' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recruitment Open</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                Recruitment Closed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Details & Requirements */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">About the Society</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {society.description}
            </p>

            {society.recruitmentDeadline && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Application Deadline: {new Date(society.recruitmentDeadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Requirements & Skills</h4>
            {society.recruitmentRequirements && society.recruitmentRequirements.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-700">
                {society.recruitmentRequirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                Open to all enthusiastic students with genuine eagerness to learn.
              </p>
            )}
          </div>

          {/* Privacy & Contact Note */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">Verified Society Contact:</p>
            <p className="text-slate-600 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{society.publicContactEmail || 'Desk contact verified'}</span>
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              Contact details will be available once verified by the society. Personal phone numbers of students are never stored publicly.
            </p>
          </div>
        </div>

        {/* Right Col: Application Form */}
        <div className="lg:col-span-2">
          {existingApp || submittedAppId ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <FileCheck className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Application Submitted</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your membership application has been received and queued for the core review committee of <strong>{society.name}</strong>.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 max-w-xs mx-auto text-xs text-slate-700">
                <span>Application Reference: </span>
                <span className="font-mono font-bold text-indigo-700">
                  #{submittedAppId || existingApp?.id}
                </span>
              </div>
              <div className="pt-2">
                <Link
                  to="/profile"
                  className="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg inline-block shadow-xs"
                >
                  Track in Your Profile
                </Link>
              </div>
            </div>
          ) : society.membershipFormUrl ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6 shadow-xs">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-lg">Official External Form</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {society.name} manages recruitment candidate screening through their official Google Form.
                </p>
              </div>

              <a
                href={society.membershipFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>Open Society Membership Form</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-base">Membership Application Form</h3>
                <p className="text-xs text-slate-500">
                  Submit your statement of interest directly to {society.name}.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
                    required
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Why do you wish to join {society.name}? *
                </label>
                <textarea
                  value={whyJoin}
                  onChange={(e) => setWhyJoin(e.target.value)}
                  rows={3}
                  placeholder="Share your goals, areas of interest, or what you hope to contribute..."
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prior Experience or Relevant Skills (Optional)
                </label>
                <textarea
                  value={priorExperience}
                  onChange={(e) => setPriorExperience(e.target.value)}
                  rows={2}
                  placeholder="e.g. Graphic design, Python, stage acting, sponsorship outreach..."
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Portfolio / GitHub / Work Link (Optional)
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Submit Membership Application
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

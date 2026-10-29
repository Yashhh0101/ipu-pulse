import React from 'react';
import { ShieldAlert, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Terms of Use & Disclaimer</h1>
            <p className="text-xs text-slate-500">Effective: Academic Session 2026</p>
          </div>
        </div>

        <div className="prose prose-slate text-xs sm:text-sm leading-relaxed space-y-4 text-slate-700">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Independent Platform Notice:</span>
            </p>
            <p className="leading-relaxed">
              IPU Pulse is an independent student information platform. Event schedules, fees, venues,
              and outsider eligibility criteria are managed by student societies and organisers. IPU
              Pulse does not claim official affiliation or endorsement from Guru Gobind Singh
              Indraprastha University (GGSIPU) or any affiliated college unless explicitly authorised.
            </p>
          </div>

          <h3 className="text-sm font-bold text-slate-900 pt-2">1. Outsider Eligibility & Campus Entry</h3>
          <p>
            An online registration generated on IPU Pulse does not override host college campus security
            or entry protocols. All external participants must present an original college photo ID card
            at campus gates and comply with university security standards.
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">2. Accuracy & Corrections</h3>
          <p>
            Demonstration prototype listings are explicitly identified with demo badges. Users are
            encouraged to report inaccurate dates, fees, or contact emails via our in-app reporting
            dialogue. Platform moderators reserve the right to review and resolve any reports.
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">3. Prohibited Conduct</h3>
          <p>
            Users and society representatives must not submit deceptive event notices, spam registration
            forms, or post defamatory content.
          </p>
        </div>
      </div>
    </div>
  );
};

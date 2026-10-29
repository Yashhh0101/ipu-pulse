import React from 'react';
import { Shield, Lock, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
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
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Last updated: October 2026</p>
          </div>
        </div>

        <div className="prose prose-slate text-xs sm:text-sm leading-relaxed space-y-4 text-slate-700">
          <p>
            IPU Pulse is committed to protecting student data and respecting privacy standards across
            all affiliated colleges under Guru Gobind Singh Indraprastha University.
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">1. Information We Collect</h3>
          <p>
            When registering for campus events or submitting society recruitment applications, we collect
            basic contact credentials such as your name, institutional email address, college affiliation,
            course, and academic year. We do not harvest or ask for sensitive financial data or personal identity documents.
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">2. Strict No-Phone-Number Policy for Contacts</h3>
          <p>
            In strict compliance with privacy standards, student representatives and society leaders'
            personal phone numbers are never stored in public database fields or rendered in client-facing
            code. All contact is facilitated via verified department email addresses and institutional channels.
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">3. Role-Based Access Control</h3>
          <p>
            Event registration submissions and membership application responses are accessible only to the
            authorised coordinators of that specific organising society and platform administrators. No
            cross-society data leakage is permitted under our Firestore Security Rules.
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">4. Contact & Inquiries</h3>
          <p>
            For privacy inquiries or data removal requests, contact privacy@ipupulse.in.
          </p>
        </div>
      </div>
    </div>
  );
};

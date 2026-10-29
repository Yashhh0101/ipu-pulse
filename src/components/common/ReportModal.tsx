import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'event' | 'society' | 'college';
  targetId: string;
  targetTitle: string;
}

export const ReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState('Inaccurate event details or dates');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.submitReport({
      targetType,
      targetId,
      targetTitle,
      reason,
      description: description.trim() || 'No additional note provided.',
      reportedBy: user?.email || 'Anonymous Student',
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      onClose();
    }, 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">Report / Correction Notice</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close report dialog"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-1">Feedback Submitted</h4>
            <p className="text-sm text-slate-600">
              Thank you. The platform administrators have logged this report for immediate verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Target Entity</p>
              <p className="text-sm font-semibold text-slate-900 bg-slate-50 p-2.5 rounded border border-slate-200">
                {targetTitle} ({targetType})
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
              >
                <option value="Inaccurate event details or dates">Inaccurate event details or dates</option>
                <option value="Incorrect outsider eligibility label">Incorrect outsider eligibility label</option>
                <option value="Broken registration link or fake form">Broken registration link or fake form</option>
                <option value="Unauthorised representative contact">Unauthorised representative contact</option>
                <option value="Duplicate or obsolete society entry">Duplicate or obsolete society entry</option>
                <option value="Other concern">Other concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional details / Correct information
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide accurate links, correct dates, or context to help moderators verify..."
                className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-900"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

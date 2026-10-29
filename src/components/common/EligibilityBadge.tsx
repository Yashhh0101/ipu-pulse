import React from 'react';
import { EligibilityType } from '../../types';
import { getEligibilityBadgeDetails } from '../../utils/rules';
import { Users, Globe, Lock, School } from 'lucide-react';

interface Props {
  type: EligibilityType;
  showExplanation?: boolean;
  explanation?: string;
  className?: string;
}

export const EligibilityBadge: React.FC<Props> = ({
  type,
  showExplanation = false,
  explanation,
  className = '',
}) => {
  const { label, badgeClass, isOutsiderFriendly } = getEligibilityBadgeDetails(type);

  const renderIcon = () => {
    switch (type) {
      case 'public_event':
        return <Globe className="w-3.5 h-3.5 shrink-0" />;
      case 'open_to_outsiders':
      case 'all_college_students':
        return <Users className="w-3.5 h-3.5 shrink-0" />;
      case 'all_ipu_colleges':
        return <School className="w-3.5 h-3.5 shrink-0" />;
      case 'society_members_only':
      case 'organising_college_only':
      default:
        return isOutsiderFriendly ? (
          <Users className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Lock className="w-3.5 h-3.5 shrink-0" />
        );
    }
  };

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${badgeClass}`}
      >
        {renderIcon()}
        <span>{label}</span>
      </span>
      {showExplanation && (
        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
          {explanation || (isOutsiderFriendly ? 'External college students are permitted to register.' : 'Restricted participation.')}
        </p>
      )}
    </div>
  );
};

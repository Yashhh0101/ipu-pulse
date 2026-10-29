import { CampusEvent, EligibilityType, EventStatus, Society } from '../types';

/**
 * Computes the accurate dynamic status of an event based on dates and organiser flag.
 */
export function computeEventStatus(
  event: Pick<CampusEvent, 'startAt' | 'endAt' | 'registrationDeadline' | 'registrationOpen'>,
  referenceNow: Date = new Date()
): {
  status: EventStatus;
  isRegistrationCurrentlyOpen: boolean;
  registrationStatusLabel: string;
} {
  const now = referenceNow.getTime();
  const startTime = new Date(event.startAt).getTime();
  const endTime = new Date(event.endAt).getTime();
  const deadlineTime = new Date(event.registrationDeadline).getTime();

  let status: EventStatus = 'upcoming';
  if (now > endTime) {
    status = 'completed';
  } else if (now >= startTime && now <= endTime) {
    status = 'ongoing';
  } else {
    status = 'upcoming';
  }

  // Registration is open ONLY if explicitly open by organiser AND now <= deadline AND event not completed
  const isPastDeadline = now > deadlineTime;
  const isRegistrationCurrentlyOpen =
    event.registrationOpen && !isPastDeadline && status !== 'completed';

  let registrationStatusLabel = 'Registration Closed';
  if (status === 'completed') {
    registrationStatusLabel = 'Event Concluded';
  } else if (!event.registrationOpen) {
    registrationStatusLabel = 'Registration Paused';
  } else if (isPastDeadline) {
    registrationStatusLabel = 'Deadline Passed';
  } else {
    registrationStatusLabel = 'Registration Open';
  }

  return {
    status,
    isRegistrationCurrentlyOpen,
    registrationStatusLabel,
  };
}

/**
 * Evaluates whether a user from a given college is eligible for an event.
 */
export function evaluateOutsiderEligibility(
  eligibilityType: EligibilityType,
  userCollegeId?: string,
  eventCollegeId?: string,
  allowedColleges?: string[]
): {
  isEligible: boolean;
  requiresCollegeCheck: boolean;
  explanation: string;
} {
  switch (eligibilityType) {
    case 'public_event':
      return {
        isEligible: true,
        requiresCollegeCheck: false,
        explanation: 'Open to the public. Anyone may register.',
      };

    case 'all_college_students':
    case 'open_to_outsiders':
      return {
        isEligible: true,
        requiresCollegeCheck: true,
        explanation: 'Open to students from all universities and colleges. Student ID required at venue.',
      };

    case 'all_ipu_colleges':
      return {
        isEligible: true,
        requiresCollegeCheck: true,
        explanation: 'Open to all students from any IPU-affiliated college.',
      };

    case 'selected_colleges_only': {
      if (!userCollegeId) {
        return {
          isEligible: false,
          requiresCollegeCheck: true,
          explanation: 'Restricted to selected colleges. Please select your college to verify.',
        };
      }
      const isAllowed = allowedColleges?.includes(userCollegeId) || userCollegeId === eventCollegeId;
      return {
        isEligible: isAllowed,
        requiresCollegeCheck: true,
        explanation: isAllowed
          ? 'Your college is included in the approved list for this event.'
          : 'This event is restricted to specific IPU colleges only.',
      };
    }

    case 'organising_college_only': {
      if (!userCollegeId) {
        return {
          isEligible: false,
          requiresCollegeCheck: true,
          explanation: 'Restricted to students of the organising college only.',
        };
      }
      const isEligible = userCollegeId === eventCollegeId;
      return {
        isEligible,
        requiresCollegeCheck: true,
        explanation: isEligible
          ? 'You belong to the organising college and are eligible.'
          : 'Only students enrolled in the host college can participate.',
      };
    }

    case 'society_members_only':
      return {
        isEligible: false,
        requiresCollegeCheck: true,
        explanation: 'Restricted to registered core and active society members only.',
      };

    case 'custom_eligibility':
    default:
      return {
        isEligible: true,
        requiresCollegeCheck: true,
        explanation: 'Custom eligibility applies. See specific organiser terms before registering.',
      };
  }
}

/**
 * Formats outsider eligibility for UI badges
 */
export function getEligibilityBadgeDetails(type: EligibilityType): {
  label: string;
  badgeClass: string;
  isOutsiderFriendly: boolean;
} {
  switch (type) {
    case 'public_event':
      return {
        label: 'Public Event',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        isOutsiderFriendly: true,
      };
    case 'open_to_outsiders':
      return {
        label: 'Open to Outsiders',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        isOutsiderFriendly: true,
      };
    case 'all_college_students':
      return {
        label: 'All College Students',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        isOutsiderFriendly: true,
      };
    case 'all_ipu_colleges':
      return {
        label: 'All IPU Students',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        isOutsiderFriendly: true,
      };
    case 'selected_colleges_only':
      return {
        label: 'Selected Colleges Only',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        isOutsiderFriendly: false,
      };
    case 'organising_college_only':
      return {
        label: 'Host College Only',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        isOutsiderFriendly: false,
      };
    case 'society_members_only':
      return {
        label: 'Members Only',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        isOutsiderFriendly: false,
      };
    case 'custom_eligibility':
    default:
      return {
        label: 'Special Eligibility',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        isOutsiderFriendly: false,
      };
  }
}

/**
 * Filter and search events with multi-criteria
 */
export function filterEvents(
  events: CampusEvent[],
  criteria: {
    query?: string;
    collegeId?: string;
    category?: string;
    eligibilityType?: string;
    format?: 'all' | 'online' | 'offline';
    fee?: 'all' | 'free' | 'paid';
    status?: 'all' | 'upcoming' | 'ongoing' | 'completed';
    registrationOpenOnly?: boolean;
    societyId?: string;
    sortBy?: 'date_asc' | 'date_desc' | 'closing_soon' | 'recently_added';
  },
  referenceNow: Date = new Date()
): CampusEvent[] {
  let filtered = events.filter((evt) => {
    // 1. Text query match
    if (criteria.query && criteria.query.trim().length > 0) {
      const q = criteria.query.toLowerCase().trim();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchDesc = evt.description.toLowerCase().includes(q);
      const matchVenue = evt.venue.toLowerCase().includes(q);
      const matchCat = evt.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchVenue && !matchCat) {
        return false;
      }
    }

    // 2. College match
    if (criteria.collegeId && criteria.collegeId !== 'all') {
      if (evt.collegeId !== criteria.collegeId) return false;
    }

    // 3. Society match
    if (criteria.societyId && evt.societyId !== criteria.societyId) {
      return false;
    }

    // 4. Category match
    if (criteria.category && criteria.category !== 'All') {
      if (evt.category !== criteria.category) return false;
    }

    // 5. Eligibility match
    if (criteria.eligibilityType && criteria.eligibilityType !== 'all') {
      if (criteria.eligibilityType === 'outsiders_welcome') {
        const friendly = ['open_to_outsiders', 'all_college_students', 'all_ipu_colleges', 'public_event'];
        if (!friendly.includes(evt.eligibilityType)) return false;
      } else if (evt.eligibilityType !== criteria.eligibilityType) {
        return false;
      }
    }

    // 6. Online/Offline format
    if (criteria.format && criteria.format !== 'all') {
      if (criteria.format === 'online' && !evt.isOnline) return false;
      if (criteria.format === 'offline' && evt.isOnline) return false;
    }

    // 7. Fee
    if (criteria.fee && criteria.fee !== 'all') {
      if (criteria.fee === 'free' && evt.isPaid) return false;
      if (criteria.fee === 'paid' && !evt.isPaid) return false;
    }

    // 8. Event status
    const dynamic = computeEventStatus(evt, referenceNow);
    if (criteria.status && criteria.status !== 'all') {
      if (dynamic.status !== criteria.status) return false;
    }

    // 9. Registration open only
    if (criteria.registrationOpenOnly) {
      if (!dynamic.isRegistrationCurrentlyOpen) return false;
    }

    return true;
  });

  // Sorting
  const sortBy = criteria.sortBy || 'date_asc';
  filtered.sort((a, b) => {
    if (sortBy === 'date_asc') {
      return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
    }
    if (sortBy === 'date_desc') {
      return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
    }
    if (sortBy === 'closing_soon') {
      return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
    }
    if (sortBy === 'recently_added') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return filtered;
}

/**
 * Filter societies with search and category
 */
export function filterSocieties(
  societies: Society[],
  criteria: {
    query?: string;
    collegeId?: string;
    category?: string;
    recruitingOnly?: boolean;
  }
): Society[] {
  return societies.filter((soc) => {
    if (criteria.collegeId && criteria.collegeId !== 'all') {
      if (soc.collegeId !== criteria.collegeId) return false;
    }
    if (criteria.category && criteria.category !== 'All') {
      if (soc.category !== criteria.category) return false;
    }
    if (criteria.recruitingOnly) {
      if (soc.recruitmentStatus !== 'recruitment_open') return false;
    }
    if (criteria.query && criteria.query.trim().length > 0) {
      const q = criteria.query.toLowerCase().trim();
      const matchName = soc.name.toLowerCase().includes(q);
      const matchDesc = soc.description.toLowerCase().includes(q);
      const matchCat = soc.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    return true;
  });
}

/**
 * Prevents duplicate registration check
 */
export function isUserAlreadyRegistered(
  existingRegistrations: { eventId: string; userId: string; status: string }[],
  eventId: string,
  userId: string
): boolean {
  return existingRegistrations.some(
    (reg) => reg.eventId === eventId && reg.userId === userId && reg.status !== 'cancelled'
  );
}

/**
 * Formats date and time cleanly
 */
export function formatEventDateTime(isoString: string): {
  date: string;
  time: string;
  formatted: string;
} {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) {
    return { date: 'TBD', time: 'TBD', formatted: 'Date TBD' };
  }
  const dateStr = d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return {
    date: dateStr,
    time: timeStr,
    formatted: `${dateStr} at ${timeStr}`,
  };
}

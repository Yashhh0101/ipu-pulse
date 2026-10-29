export type UserRole = 'student' | 'society_admin' | 'platform_admin';

export type EligibilityType =
  | 'society_members_only'
  | 'organising_college_only'
  | 'selected_colleges_only'
  | 'all_ipu_colleges'
  | 'all_college_students'
  | 'open_to_outsiders'
  | 'public_event'
  | 'custom_eligibility';

export type EventCategory =
  | 'Technical'
  | 'Coding and AI'
  | 'Cultural'
  | 'Dance and Music'
  | 'Literary'
  | 'Entrepreneurship'
  | 'Sports'
  | 'Social Impact'
  | 'Legal and Debate'
  | 'Other';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type VerificationStatus = 'verified' | 'unverified_demo' | 'pending_verification';

export type RegistrationMode = 'internal' | 'external';

export type RegistrationStatus =
  | 'registered'
  | 'pending'
  | 'confirmed'
  | 'waitlisted'
  | 'cancelled'
  | 'rejected';

export type RecruitmentStatus =
  | 'recruitment_open'
  | 'recruitment_upcoming'
  | 'recruitment_closed'
  | 'not_recruiting'
  | 'unconfirmed';

export interface College {
  id: string;
  name: string;
  abbreviation: string;
  location: string;
  officialWebsite?: string;
  logoUrl?: string;
  isActive: boolean;
  verificationStatus: VerificationStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Society {
  id: string;
  collegeId: string;
  name: string;
  category: EventCategory;
  description: string;
  logoUrl?: string;
  officialWebsite?: string;
  officialSocialLinks?: {
    instagram?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  recruitmentStatus: RecruitmentStatus;
  recruitmentDeadline?: string;
  recruitmentRequirements?: string[];
  membershipFormUrl?: string;
  publicContactEmail?: string;
  approvedContactDetails?: {
    designation: string;
    name?: string;
    email?: string;
  };
  verificationStatus: VerificationStatus;
  publicationStatus: 'published' | 'draft' | 'archived';
  adminUserIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  societyId: string;
  collegeId: string;
  category: EventCategory;
  posterUrl: string;
  startAt: string; // ISO date string
  endAt: string; // ISO date string
  registrationDeadline: string; // ISO date string
  venue: string;
  isOnline: boolean;
  onlineMeetingUrl?: string;
  isPaid: boolean;
  entryFee?: number;
  eligibilityType: EligibilityType;
  eligibilityDescription: string;
  allowedColleges?: string[]; // When eligibilityType is selected_colleges_only
  registrationMode: RegistrationMode;
  registrationUrl?: string; // For external Google Forms
  registrationOpen: boolean;
  maxAttendees?: number;
  verificationStatus: VerificationStatus;
  publicationStatus: 'published' | 'draft' | 'pending_approval';
  isFictionalDemo: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  selectedCollegeId: string;
  course?: string;
  year?: string;
  interests?: EventCategory[];
  role: UserRole;
  managedSocietyIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userEmail: string;
  userName: string;
  collegeName: string;
  rollNumber?: string;
  course?: string;
  year?: string;
  phoneNumber?: string;
  teamName?: string;
  customAnswers?: Record<string, string>;
  status: RegistrationStatus;
  submittedAt: string;
  updatedAt: string;
}

export interface MembershipApplication {
  id: string;
  societyId: string;
  collegeId: string;
  userId: string;
  userName: string;
  userEmail: string;
  collegeName: string;
  course: string;
  year: string;
  whyJoin: string;
  priorExperience?: string;
  portfolioUrl?: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
  submittedAt: string;
  updatedAt: string;
}

export interface UserReport {
  id: string;
  targetType: 'event' | 'society' | 'college';
  targetId: string;
  targetTitle: string;
  reason: string;
  description: string;
  reportedBy: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

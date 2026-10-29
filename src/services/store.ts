import {
  College,
  Society,
  CampusEvent,
  UserProfile,
  EventRegistration,
  MembershipApplication,
  UserReport,
} from '../types';
import { INITIAL_COLLEGES, INITIAL_SOCIETIES, INITIAL_EVENTS } from '../data/seedData';
import { isUserAlreadyRegistered } from '../utils/rules';

const STORAGE_KEYS = {
  COLLEGES: 'ipu_pulse_colleges_v1',
  SOCIETIES: 'ipu_pulse_societies_v1',
  EVENTS: 'ipu_pulse_events_v1',
  REGISTRATIONS: 'ipu_pulse_registrations_v1',
  MEMBERSHIPS: 'ipu_pulse_memberships_v1',
  SAVED_EVENTS: 'ipu_pulse_saved_events_v1',
  SAVED_SOCIETIES: 'ipu_pulse_saved_societies_v1',
  REPORTS: 'ipu_pulse_reports_v1',
  CURRENT_USER: 'ipu_pulse_current_user_v1',
  SELECTED_COLLEGE: 'ipu_pulse_selected_college_v1',
};

// Default Demo Users for rapid testing
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-student-demo',
    email: 'yash.engineer06@gmail.com',
    displayName: 'Yash Sharma',
    selectedCollegeId: 'adgitm',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    interests: ['Coding and AI', 'Technical', 'Dance and Music'],
    role: 'student',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-10-25T00:00:00Z',
  },
  {
    id: 'user-society-admin',
    email: 'society.lead@adgitm.ac.in',
    displayName: 'Aarav Patel (Society Lead)',
    selectedCollegeId: 'adgitm',
    course: 'B.Tech IT',
    year: '4th Year',
    role: 'society_admin',
    managedSocietyIds: ['ieee-adgitm', 'codechef-adgitm'],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-10-25T00:00:00Z',
  },
  {
    id: 'user-platform-admin',
    email: 'admin@ipupulse.in',
    displayName: 'University Moderator',
    selectedCollegeId: 'adgitm',
    role: 'platform_admin',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-25T00:00:00Z',
  },
];

class StoreService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.COLLEGES)) {
      localStorage.setItem(STORAGE_KEYS.COLLEGES, JSON.stringify(INITIAL_COLLEGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SOCIETIES)) {
      localStorage.setItem(STORAGE_KEYS.SOCIETIES, JSON.stringify(INITIAL_SOCIETIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS)) {
      localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(['evt-hacknova-2026']));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_SOCIETIES)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_SOCIETIES, JSON.stringify(['ieee-adgitm']));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SELECTED_COLLEGE)) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_COLLEGE, 'adgitm');
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- COLLEGES ---
  public getColleges(): College[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COLLEGES);
    return raw ? JSON.parse(raw) : INITIAL_COLLEGES;
  }

  public getCollegeById(id: string): College | undefined {
    return this.getColleges().find((c) => c.id === id);
  }

  public updateCollegeVerification(id: string, status: 'verified' | 'unverified_demo'): void {
    const colleges = this.getColleges().map((c) =>
      c.id === id ? { ...c, verificationStatus: status, updatedAt: new Date().toISOString() } : c
    );
    localStorage.setItem(STORAGE_KEYS.COLLEGES, JSON.stringify(colleges));
    this.notify();
  }

  // --- SOCIETIES ---
  public getSocieties(): Society[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SOCIETIES);
    return raw ? JSON.parse(raw) : INITIAL_SOCIETIES;
  }

  public getSocietyById(id: string): Society | undefined {
    return this.getSocieties().find((s) => s.id === id);
  }

  public getSocietiesByCollege(collegeId: string): Society[] {
    return this.getSocieties().filter((s) => s.collegeId === collegeId);
  }

  public saveSociety(society: Society): void {
    const societies = this.getSocieties();
    const index = societies.findIndex((s) => s.id === society.id);
    if (index >= 0) {
      societies[index] = { ...society, updatedAt: new Date().toISOString() };
    } else {
      societies.unshift(society);
    }
    localStorage.setItem(STORAGE_KEYS.SOCIETIES, JSON.stringify(societies));
    this.notify();
  }

  public updateSocietyVerification(id: string, status: 'verified' | 'unverified_demo'): void {
    const societies = this.getSocieties().map((s) =>
      s.id === id ? { ...s, verificationStatus: status, updatedAt: new Date().toISOString() } : s
    );
    localStorage.setItem(STORAGE_KEYS.SOCIETIES, JSON.stringify(societies));
    this.notify();
  }

  // --- EVENTS ---
  public getEvents(): CampusEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return raw ? JSON.parse(raw) : INITIAL_EVENTS;
  }

  public getEventById(id: string): CampusEvent | undefined {
    return this.getEvents().find((e) => e.id === id);
  }

  public saveEvent(event: CampusEvent): void {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      events[index] = { ...event, updatedAt: new Date().toISOString() };
    } else {
      events.unshift(event);
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    this.notify();
  }

  public deleteEvent(id: string): void {
    const events = this.getEvents().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    this.notify();
  }

  public toggleEventRegistration(id: string, open: boolean): void {
    const events = this.getEvents().map((e) =>
      e.id === id ? { ...e, registrationOpen: open, updatedAt: new Date().toISOString() } : e
    );
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    this.notify();
  }

  public updateEventVerification(id: string, status: 'verified' | 'unverified_demo'): void {
    const events = this.getEvents().map((e) =>
      e.id === id ? { ...e, verificationStatus: status, updatedAt: new Date().toISOString() } : e
    );
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    this.notify();
  }

  // --- REGISTRATIONS ---
  public getRegistrations(): EventRegistration[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    return raw ? JSON.parse(raw) : [];
  }

  public registerForEvent(
    data: Omit<EventRegistration, 'id' | 'submittedAt' | 'updatedAt' | 'status'>
  ): { success: boolean; message: string; registration?: EventRegistration } {
    const registrations = this.getRegistrations();

    if (isUserAlreadyRegistered(registrations, data.eventId, data.userId)) {
      return {
        success: false,
        message: 'You have already submitted a registration for this event.',
      };
    }

    const newReg: EventRegistration = {
      ...data,
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'confirmed',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    registrations.unshift(newReg);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    this.notify();
    return { success: true, message: 'Registration submitted successfully!', registration: newReg };
  }

  public getUserRegistrations(userId: string): EventRegistration[] {
    return this.getRegistrations().filter((r) => r.userId === userId);
  }

  public getEventRegistrations(eventId: string): EventRegistration[] {
    return this.getRegistrations().filter((r) => r.eventId === eventId);
  }

  public updateRegistrationStatus(id: string, status: EventRegistration['status']): void {
    const list = this.getRegistrations().map((r) =>
      r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(list));
    this.notify();
  }

  // --- MEMBERSHIP APPLICATIONS ---
  public getMembershipApplications(): MembershipApplication[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS);
    return raw ? JSON.parse(raw) : [];
  }

  public submitMembershipApplication(
    data: Omit<MembershipApplication, 'id' | 'submittedAt' | 'updatedAt' | 'status'>
  ): { success: boolean; message: string; application?: MembershipApplication } {
    const list = this.getMembershipApplications();
    const existing = list.find((a) => a.societyId === data.societyId && a.userId === data.userId);
    if (existing) {
      return {
        success: false,
        message: 'You have already submitted a membership application to this society.',
      };
    }

    const newApp: MembershipApplication = {
      ...data,
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(list));
    this.notify();
    return { success: true, message: 'Membership application submitted!', application: newApp };
  }

  public getUserMembershipApplications(userId: string): MembershipApplication[] {
    return this.getMembershipApplications().filter((a) => a.userId === userId);
  }

  public getSocietyMembershipApplications(societyId: string): MembershipApplication[] {
    return this.getMembershipApplications().filter((a) => a.societyId === societyId);
  }

  public updateMembershipStatus(id: string, status: MembershipApplication['status']): void {
    const list = this.getMembershipApplications().map((a) =>
      a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
    );
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(list));
    this.notify();
  }

  // --- SAVED ITEMS ---
  public getSavedEventIds(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_EVENTS);
    return raw ? JSON.parse(raw) : [];
  }

  public toggleSaveEvent(eventId: string): boolean {
    const ids = this.getSavedEventIds();
    const exists = ids.includes(eventId);
    const updated = exists ? ids.filter((id) => id !== eventId) : [...ids, eventId];
    localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(updated));
    this.notify();
    return !exists;
  }

  public getSavedSocietyIds(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_SOCIETIES);
    return raw ? JSON.parse(raw) : [];
  }

  public toggleSaveSociety(societyId: string): boolean {
    const ids = this.getSavedSocietyIds();
    const exists = ids.includes(societyId);
    const updated = exists ? ids.filter((id) => id !== societyId) : [...ids, societyId];
    localStorage.setItem(STORAGE_KEYS.SAVED_SOCIETIES, JSON.stringify(updated));
    this.notify();
    return !exists;
  }

  // --- REPORTS ---
  public getReports(): UserReport[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : [];
  }

  public submitReport(data: Omit<UserReport, 'id' | 'createdAt' | 'status'>): void {
    const reports = this.getReports();
    reports.unshift({
      ...data,
      id: `rep-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    this.notify();
  }

  public updateReportStatus(id: string, status: UserReport['status']): void {
    const reports = this.getReports().map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    this.notify();
  }

  // --- CURRENT USER ---
  public getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  }

  public setCurrentUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notify();
  }

  public updateUserProfile(updates: Partial<UserProfile>): void {
    const current = this.getCurrentUser();
    if (!current) return;
    // Disallow role changes via standard profile edit as required by spec
    const { role: _, ...allowed } = updates;
    const updated = { ...current, ...allowed, updatedAt: new Date().toISOString() };
    this.setCurrentUser(updated);
  }

  // --- SELECTED COLLEGE ---
  public getSelectedCollegeId(): string {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_COLLEGE) || 'adgitm';
  }

  public setSelectedCollegeId(collegeId: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_COLLEGE, collegeId);
    const current = this.getCurrentUser();
    if (current) {
      this.setCurrentUser({ ...current, selectedCollegeId: collegeId });
    }
    this.notify();
  }

  // Reset to initial demo data
  public resetToFactoryDemo(): void {
    localStorage.setItem(STORAGE_KEYS.COLLEGES, JSON.stringify(INITIAL_COLLEGES));
    localStorage.setItem(STORAGE_KEYS.SOCIETIES, JSON.stringify(INITIAL_SOCIETIES));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(['evt-hacknova-2026']));
    localStorage.setItem(STORAGE_KEYS.SAVED_SOCIETIES, JSON.stringify(['ieee-adgitm']));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.SELECTED_COLLEGE, 'adgitm');
    this.notify();
  }
}

export const appStore = new StoreService();

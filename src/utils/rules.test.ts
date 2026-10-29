import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeEventStatus,
  evaluateOutsiderEligibility,
  filterEvents,
  isUserAlreadyRegistered,
} from './rules';
import { CampusEvent } from '../types';

test('computeEventStatus correctly marks upcoming, ongoing, and completed events', () => {
  const reference = new Date('2026-11-01T12:00:00Z');

  // Case 1: Future event with registration open
  const futureEvent = {
    startAt: '2026-11-05T10:00:00Z',
    endAt: '2026-11-05T18:00:00Z',
    registrationDeadline: '2026-11-04T23:59:59Z',
    registrationOpen: true,
  };
  const res1 = computeEventStatus(futureEvent, reference);
  assert.equal(res1.status, 'upcoming');
  assert.equal(res1.isRegistrationCurrentlyOpen, true);
  assert.equal(res1.registrationStatusLabel, 'Registration Open');

  // Case 2: Future event where registration deadline passed
  const deadlinePassedEvent = {
    startAt: '2026-11-05T10:00:00Z',
    endAt: '2026-11-05T18:00:00Z',
    registrationDeadline: '2026-10-31T23:59:59Z',
    registrationOpen: true,
  };
  const res2 = computeEventStatus(deadlinePassedEvent, reference);
  assert.equal(res2.status, 'upcoming');
  assert.equal(res2.isRegistrationCurrentlyOpen, false);
  assert.equal(res2.registrationStatusLabel, 'Deadline Passed');

  // Case 3: Completed event
  const completedEvent = {
    startAt: '2026-10-20T10:00:00Z',
    endAt: '2026-10-20T18:00:00Z',
    registrationDeadline: '2026-10-19T23:59:59Z',
    registrationOpen: true,
  };
  const res3 = computeEventStatus(completedEvent, reference);
  assert.equal(res3.status, 'completed');
  assert.equal(res3.isRegistrationCurrentlyOpen, false);
  assert.equal(res3.registrationStatusLabel, 'Event Concluded');
});

test('evaluateOutsiderEligibility correctly assesses student eligibility', () => {
  // Public event
  const pub = evaluateOutsiderEligibility('public_event', 'msit', 'adgitm');
  assert.equal(pub.isEligible, true);

  // All IPU Colleges
  const ipu = evaluateOutsiderEligibility('all_ipu_colleges', 'mait', 'adgitm');
  assert.equal(ipu.isEligible, true);

  // Organising college only: student is from same college
  const sameCollege = evaluateOutsiderEligibility('organising_college_only', 'adgitm', 'adgitm');
  assert.equal(sameCollege.isEligible, true);

  // Organising college only: student is from another college
  const diffCollege = evaluateOutsiderEligibility('organising_college_only', 'mait', 'adgitm');
  assert.equal(diffCollege.isEligible, false);

  // Selected colleges only
  const selectedEligible = evaluateOutsiderEligibility(
    'selected_colleges_only',
    'bpit',
    'adgitm',
    ['bpit', 'bvcoe']
  );
  assert.equal(selectedEligible.isEligible, true);

  const selectedIneligible = evaluateOutsiderEligibility(
    'selected_colleges_only',
    'gtbit',
    'adgitm',
    ['bpit', 'bvcoe']
  );
  assert.equal(selectedIneligible.isEligible, false);

  // Society members only
  const membersOnly = evaluateOutsiderEligibility('society_members_only', 'adgitm', 'adgitm');
  assert.equal(membersOnly.isEligible, false);
});

test('isUserAlreadyRegistered correctly prevents duplicate registrations', () => {
  const registrations = [
    { eventId: 'evt-1', userId: 'user-123', status: 'confirmed' },
    { eventId: 'evt-2', userId: 'user-123', status: 'cancelled' },
  ];

  // User already active on evt-1
  assert.equal(isUserAlreadyRegistered(registrations, 'evt-1', 'user-123'), true);

  // User cancelled on evt-2, so re-registration is permitted
  assert.equal(isUserAlreadyRegistered(registrations, 'evt-2', 'user-123'), false);

  // Different user on evt-1
  assert.equal(isUserAlreadyRegistered(registrations, 'evt-1', 'user-456'), false);
});

test('filterEvents correctly matches category, college, and text search', () => {
  const mockEvents = [
    {
      id: 'e1',
      title: 'HackNova 2026',
      description: 'Annual flagship hackathon of ADGITM',
      collegeId: 'adgitm',
      societyId: 'codechef-adgitm',
      category: 'Coding and AI',
      venue: 'Auditorium, Block B',
      isOnline: false,
      isPaid: false,
      startAt: '2026-11-10T10:00:00Z',
      endAt: '2026-11-11T18:00:00Z',
      registrationDeadline: '2026-11-08T23:59:59Z',
      registrationOpen: true,
      eligibilityType: 'all_ipu_colleges',
      publicationStatus: 'published',
      isFictionalDemo: true,
    } as unknown as CampusEvent,
    {
      id: 'e2',
      title: 'Rhythm Clash Dance Battle',
      description: 'Western and folk dance showcase',
      collegeId: 'mait',
      societyId: 'freak-streets',
      category: 'Dance and Music',
      venue: 'Main Ground',
      isOnline: false,
      isPaid: false,
      startAt: '2026-11-15T10:00:00Z',
      endAt: '2026-11-15T18:00:00Z',
      registrationDeadline: '2026-11-12T23:59:59Z',
      registrationOpen: true,
      eligibilityType: 'open_to_outsiders',
      publicationStatus: 'published',
      isFictionalDemo: true,
    } as unknown as CampusEvent,
  ];

  // Filter by query "hackathon"
  const r1 = filterEvents(mockEvents, { query: 'hackathon' });
  assert.equal(r1.length, 1);
  assert.equal(r1[0].id, 'e1');

  // Filter by college "adgitm"
  const r2 = filterEvents(mockEvents, { collegeId: 'adgitm' });
  assert.equal(r2.length, 1);
  assert.equal(r2[0].id, 'e1');

  // Filter by category "Dance and Music"
  const r3 = filterEvents(mockEvents, { category: 'Dance and Music' });
  assert.equal(r3.length, 1);
  assert.equal(r3[0].id, 'e2');
});

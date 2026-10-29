# IPU Pulse — Campus Discovery Platform

> **Tagline:** Every College. Every Society. Every Opportunity.  
> **Platform:** Independent society discovery, campus event schedule, outsider eligibility checker, and recruitment portal for colleges affiliated with Guru Gobind Singh Indraprastha University (GGSIPU).

---

## 🏛️ Supported Colleges (Initial 10)
1. **ADGITM** — Dr. Akhilesh Das Gupta Institute of Technology & Management (Shastri Park, New Delhi)
2. **MAIT** — Maharaja Agrasen Institute of Technology (Rohini, Delhi)
3. **MSIT** — Maharaja Surajmal Institute of Technology (Janakpuri, New Delhi)
4. **BPIT** — Bhagwan Parshuram Institute of Technology (Rohini, Delhi)
5. **BVCOE** — Bharati Vidyapeeth's College of Engineering (Paschim Vihar, New Delhi)
6. **GTBIT** — Guru Tegh Bahadur Institute of Technology (Rajouri Garden, New Delhi)
7. **DITE** — Delhi Institute of Tool Engineering (Okhla & Wazirpur)
8. **AIACTR** — Ambedkar Institute of Advanced Communication Technologies & Research (Geeta Colony)
9. **GNIT** — Guru Nanak Institute of Technology (New Delhi)
10. **GTB4CEC** — Guru Tegh Bahadur 4th Centenary Engineering College (New Delhi)

---

## 🎯 Key Features

1. **Campus Selection & Dedicated College Dashboards (`/colleges/:collegeId`)**
   - Search across 10 colleges with instant real-time filtering by name or acronym.
   - Dedicated college dashboard showing active societies, upcoming fests, and live ongoing events.

2. **Society Directory & Profiles (`/colleges/:collegeId/societies/:societyId`)**
   - 14 ADGITM demonstration societies (IEEE, CodeChef, Robogyan, Kritrim Dhi, DataZoic, BitYug, SAE-ME, Freak Streets, Swaranjali, Quintessence, Word Wizards, The Invincibles, Moot Court, Legal Aid Cell).
   - 6 functional tabs: Overview, Upcoming Events, Ongoing Events, Past Events, Membership, and Contact.
   - Transparent verification labels (`Verified Official` vs `Demo Record (Unverified)`).

3. **Outsider Eligibility Engine (`/events`)**
   - Explicit badges and rules: *All IPU Colleges*, *Open to Outsiders*, *Host College Only*, *Society Members Only*, *Public Event*.
   - Explanations of venue physical ID requirements to prevent confusion at security gates.

4. **Event Registration Flow (`/events/:eventId/register`)**
   - Validated internal forms with pass generation (`#reg-...`).
   - Duplicate registration prevention.
   - External Google Form handoff mode with clear notices.

5. **Society Membership & Recruitment (`/membership`)**
   - Direct tracking of societies actively recruiting new members.
   - Candidate interest application submission with review status tracking.

6. **Role-Based Portals & Evaluation Switcher**
   - **Student Dashboard (`/profile`)**: Manage booked passes, cancel registrations, view saved items, and track applications.
   - **Society Admin Console (`/admin/society`)**: Create and edit events, open/close registrations, view participant roster, and export CSV data.
   - **Platform Admin Console (`/admin/platform`)**: Verify records, monitor real database metrics, and handle community correction reports.
   - **Role Switcher in Navbar**: Seamless 1-click preview between Student, Society Admin, and Platform Admin.

7. **Natural Language AI Event Discovery**
   - Translates prompts like *"Show coding events where students from other colleges are allowed"* into strict database filters without hallucinations.

---

## 🔒 Security & Firestore Rules
- Production-ready `firestore.rules` provided in the root directory.
- Restricts private user records and registration rosters exclusively to authorised organizers.
- Zero sensitive data exposure: phone numbers of student organizers are strictly never published or stored publicly.

---

## 🚀 Running Locally
```bash
# Install dependencies
npm install

# Run unit tests (logic & calculations)
npx --yes tsx --test src/utils/rules.test.ts

# Start development server
npm run dev
```

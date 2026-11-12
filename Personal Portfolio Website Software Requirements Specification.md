# Personal Portfolio Website: Software Requirements Specification

Version 1.0 · Prepared for the site owner · Status: Draft

## 1. Introduction

### 1.1 Purpose

This document specifies the requirements for a personal portfolio website with a private admin area. It is the reference for design, development, testing and deployment.

### 1.2 Scope

The system is a public website showing the owner's profile, skills, experience and projects, plus a protected admin area where only the owner can manage content, the profile picture, appearance, GitHub project import, an AI chatbot and a job-tailored CV generator that exports ATS-friendly PDFs. The site must stay online at all times on a custom domain.

Out of scope for version 1: multi-user accounts, a blog with comments, e-commerce, and automatic LinkedIn scraping (prohibited by LinkedIn's terms and not supported by a public API).

### 1.3 Definitions

| Term | Meaning |
| --- | --- |
| Visitor | Any person viewing the public site; read-only |
| Admin | The site owner, authenticated; full control |
| ATS | Applicant Tracking System that parses CVs automatically |
| JD | Job description |
| SSG / ISR | Static generation / incremental static regeneration |
| CRUD | Create, read, update, delete |

### 1.4 References

IEEE 830 SRS structure (as a guide); GitHub REST API documentation; Next.js, Supabase and Vercel documentation.

## 2. Overall Description

### 2.1 Product perspective

A standalone web application with a public front end, an authenticated admin interface, a PostgreSQL database, file storage for images, and server-side integrations with the GitHub API and an LLM API.

### 2.2 Users

| User | Description | Permissions |
| --- | --- | --- |
| Visitor | Recruiter, client, peer | View public pages, use chatbot, download public CV if enabled |
| Admin | Site owner | All visitor rights plus create, edit, delete content, upload images, change design, run imports, generate CVs |

### 2.3 Recommended technology stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (React, TypeScript) |
| Styling | Tailwind CSS, shadcn/ui |
| Database | PostgreSQL on Supabase |
| ORM | Prisma or Drizzle |
| Authentication | Supabase Auth (email allow-list) |
| File storage | Supabase Storage |
| Hosting | Vercel |
| Domain | Student-pack domain (e.g. .me) via Namecheap, DNS pointed to Vercel |
| AI | LLM API called from server routes only |
| PDF | @react-pdf/renderer or equivalent text-based PDF library |
| Monitoring | UptimeRobot or Better Stack, Vercel logs |

### 2.4 Operating environment

Modern browsers (latest two versions of Chrome, Edge, Firefox, Safari) on desktop and mobile.

### 2.5 Assumptions and dependencies

- The owner can verify student status for a free first-year domain; renewal is paid afterwards.
- Free tiers of hosting and database are sufficient for portfolio traffic; their terms may change.
- The LLM API is pay-per-use and requires a spending limit.
- GitHub API access uses a personal access token stored as an environment variable.

## 3. Functional Requirements

Priority: M = must have, S = should have, C = could have.

### 3.1 Public site

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-1.1 | The home page shall display the owner's name, headline, bio, photo and contact links. | M |
| FR-1.2 | The site shall display sections for skills, experience, projects and the chatbot, in the owner-defined order. | M |
| FR-1.3 | Each project shall show a name, description and link, with optional tags and image. | M |
| FR-1.4 | Visitors shall have read-only access; no edit controls shall be rendered or reachable for them. | M |
| FR-1.5 | Pages shall be indexable, with titles, meta descriptions and Open Graph previews. | S |
| FR-1.6 | The site shall provide a contact method (mailto link or contact form with spam protection). | S |

### 3.2 Authentication and authorization

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-2.1 | The admin area shall be available only at a protected route (e.g. /admin). | M |
| FR-2.2 | Only an allow-listed owner email shall be able to sign in. | M |
| FR-2.3 | All write operations shall be enforced on the server and database (row-level security), not only hidden in the interface. | M |
| FR-2.4 | Sessions shall expire and the admin shall be able to sign out. | M |
| FR-2.5 | Two-factor authentication shall be enabled on the admin account. | S |
| FR-2.6 | Repeated failed sign-ins shall be rate-limited. | S |

### 3.3 Content management (CRUD)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-3.1 | The admin shall create, edit and delete profile information. | M |
| FR-3.2 | The admin shall create, edit, reorder and delete experience entries (role, company, period, bullet points). | M |
| FR-3.3 | The admin shall create, edit, reorder and delete projects. | M |
| FR-3.4 | The admin shall manage skills (add, remove, group). | M |
| FR-3.5 | The admin shall add education, certificates and custom sections. | S |
| FR-3.6 | Deleting an item shall require confirmation. | M |
| FR-3.7 | Saved changes shall appear on the public site within one minute (via revalidation). | M |
| FR-3.8 | The admin shall be able to save entries as draft or hidden. | C |

### 3.4 Profile picture and media

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-4.1 | The admin shall upload, replace and remove the profile picture. | M |
| FR-4.2 | Uploads shall be validated for type (JPG, PNG, WebP) and size (maximum 5 MB). | M |
| FR-4.3 | Images shall be resized and served in optimized formats. | S |
| FR-4.4 | Project images may be uploaded the same way. | S |

### 3.5 Appearance customization

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-5.1 | The admin shall choose colors (accent, background, card, text) or a preset palette. | M |
| FR-5.2 | The admin shall choose heading and body fonts from a curated list. | S |
| FR-5.3 | The admin shall set corner roundness, page width, photo shape and size, and header alignment. | S |
| FR-5.4 | The admin shall rename, show, hide and reorder sections. | M |
| FR-5.5 | The admin shall set a greeting line and footer text. | C |
| FR-5.6 | The design shall support light and dark modes. | S |
| FR-5.7 | Design changes shall preview live before saving and be resettable to defaults. | S |

### 3.6 GitHub and LinkedIn integration

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-6.1 | The server shall fetch the owner's public repositories from the GitHub API using a server-held token. | M |
| FR-6.2 | The admin shall select which fetched repositories become projects; imported data shall be editable. | M |
| FR-6.3 | GitHub data shall refresh on a schedule (e.g. daily) and by manual action. | S |
| FR-6.4 | The system shall tolerate GitHub API failures by showing the last stored data. | M |
| FR-6.5 | LinkedIn data shall be imported by manual entry, pasted text parsed by the AI, or upload of LinkedIn's data export file. The system shall not scrape LinkedIn. | S |
| FR-6.6 | Imported entries shall be shown to the admin for review before they are published. | M |

### 3.7 Chatbot

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-7.1 | The site shall embed a chatbot that answers visitor questions about the owner using stored profile data only. | M |
| FR-7.2 | The chatbot shall be served by a server route; API keys shall never reach the browser. | M |
| FR-7.3 | The chatbot shall say when it does not know and shall not invent facts. | M |
| FR-7.4 | The admin shall alternatively set an external chatbot URL embedded through an iframe. | S |
| FR-7.5 | Requests shall be rate-limited per visitor and capped by a monthly spending limit. | M |
| FR-7.6 | Input and output length shall be limited, and abusive prompts shall be handled safely. | S |

### 3.8 Job-tailored CV generator

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-8.1 | The admin shall paste a job description and request a tailored CV. | M |
| FR-8.2 | The system shall build the CV only from facts stored in the owner's profile; it shall not invent employers, titles, dates or skills. | M |
| FR-8.3 | The AI shall return structured data (summary, skills, experience bullets, projects), validated against a schema before use. | M |
| FR-8.4 | The admin shall preview and edit the generated CV before export. | M |
| FR-8.5 | The admin shall download the CV as a PDF with real selectable text, single-column layout, standard fonts and plain headings (Summary, Skills, Experience, Projects, Education). | M |
| FR-8.6 | The PDF shall not use images of text, tables, text boxes, icons or multi-column layouts. | M |
| FR-8.7 | The admin shall save tailored CVs with the job title and company for later reuse. | S |
| FR-8.8 | The system shall report keywords from the JD that are matched and not matched. | C |

### 3.9 Administration and maintenance

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-9.1 | The admin shall export all site data as a JSON file. | S |
| FR-9.2 | The admin shall see a dashboard of key information (last update, GitHub sync status, chatbot usage). | C |
| FR-9.3 | Errors shall be logged for review. | S |

## 4. External Interface Requirements

### 4.1 User interface

- Responsive design from 360 px wide phones to large desktops.
- Keyboard-accessible controls with visible focus and labelled form fields.
- The admin area shall be clearly separated from public pages.

### 4.2 Software interfaces

| Interface | Purpose | Notes |
| --- | --- | --- |
| GitHub REST API | Fetch repositories | Token in environment variable; respect rate limits |
| LLM API | Chatbot, text parsing, CV tailoring | Server side only; spending cap |
| Supabase | Database, auth, storage | Row-level security enabled |
| Vercel | Build, hosting, cron jobs | Preview deployments and rollback |
| Domain registrar DNS | Custom domain | A and CNAME records to Vercel |

## 5. Non-Functional Requirements

| ID | Category | Requirement |
| --- | --- | --- |
| NFR-1 | Availability | Public pages shall be served from a CDN as static or cached content, targeting at least 99.9% monthly availability. Public pages shall remain available if the database or an AI service is temporarily unavailable. |
| NFR-2 | Performance | Largest Contentful Paint under 2.5 s on a typical mobile connection; Lighthouse performance score of at least 90. |
| NFR-3 | Security | HTTPS everywhere; secrets only in environment variables; input validation and output escaping against XSS and injection; security headers; dependency updates. |
| NFR-4 | Privacy | Collect minimal visitor data; disclose analytics and chatbot data handling; do not store chat transcripts longer than needed. |
| NFR-5 | Accessibility | Meet WCAG 2.1 AA for contrast, keyboard use and alt text. |
| NFR-6 | SEO | Semantic HTML, sitemap, robots.txt, structured data for a person. |
| NFR-7 | Maintainability | TypeScript, linting, documented setup, version control on GitHub. |
| NFR-8 | Backup and recovery | Regular database export; ability to roll back a deployment in one step. |
| NFR-9 | Monitoring | External uptime check every 5 minutes or less with email alerts. |
| NFR-10 | Cost | Operate within free tiers except domain renewal and pay-per-use AI, with a spending limit. |
| NFR-11 | Compatibility | Support the browsers listed in section 2.4. |
| NFR-12 | Scalability | Handle sudden traffic (e.g. a shared link) through CDN caching without code changes. |

## 6. Data Requirements

### 6.1 Main entities

| Entity | Key fields |
| --- | --- |
| Profile | id, name, headline, bio, photo\_url, email, github\_url, linkedin\_url, chatbot\_url |
| Skill | id, name, group, sort\_order |
| Experience | id, role, company, start\_date, end\_date, bullets, sort\_order, visible |
| Project | id, name, description, link, repo\_url, tags, image\_url, source (manual or github), sort\_order, visible |
| Education | id, institution, degree, period, details |
| Theme | id, colors, heading\_font, body\_font, radius, width, photo\_shape, photo\_size, align, section\_order, section\_titles, hidden\_sections, custom\_css |
| SavedCV | id, job\_title, company, jd\_text, cv\_json, created\_at |
| SyncLog | id, source, status, message, run\_at |

### 6.2 Data rules

- Public tables are readable by everyone and writable only by the admin.
- SavedCV and SyncLog are readable and writable only by the admin.
- Custom CSS entered by the admin shall be treated as trusted-owner input and never accepted from visitors.

## 7. Constraints

- The LinkedIn profile cannot be read automatically through an official public API.
- Free hosting and database tiers may pause or limit usage; the design must tolerate this.
- Free first-year domain renews at the registrar's normal price.
- AI output can be wrong, so every generated CV requires owner review before use.

## 8. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Free database pauses from inactivity | Scheduled ping, static pages, cached content |
| Domain expires after the free year | Auto-renew, calendar reminder, decide renewal or migration early |
| Chatbot abuse raises API cost | Rate limits, token caps, spending limit |
| API key leak | Server-only keys, environment variables, rotate if exposed |
| AI invents CV content | Facts-only prompt, schema validation, mandatory preview |
| Admin account compromise | 2FA, email allow-list, row-level security |
| Bad deployment breaks the site | Preview deployments, one-click rollback |

## 9. Delivery Plan

| Phase | Deliverable |
| --- | --- |
| 1 | Static portfolio in Next.js, deployed on Vercel with custom domain |
| 2 | Database integration; content rendered from data |
| 3 | Admin login and CRUD forms |
| 4 | Image upload and appearance customization |
| 5 | GitHub project import and scheduled sync |
| 6 | Chatbot with rate limits |
| 7 | CV tailoring and ATS-friendly PDF export |
| 8 | Monitoring, backups, accessibility and performance pass |

## 10. Acceptance Criteria

1. A visitor can view all public sections on mobile and desktop and cannot reach any edit function.
2. Only the owner's account can sign in to the admin area; a non-owner request to a write endpoint is rejected by the server.
3. The admin can add, edit and delete profile, experience, project and skill entries, and changes appear publicly within one minute.
4. The admin can upload, replace and remove the profile picture.
5. Theme changes preview live and persist after saving.
6. GitHub repositories import with review, and a GitHub failure does not break public pages.
7. The chatbot answers from profile data, declines unknown questions and enforces its rate limit.
8. Given a job description, the system produces a tailored CV with no facts outside the profile, and the exported PDF's text can be selected, copied and parsed by a plain-text extractor in the correct reading order.
9. The site is reachable on the custom domain over HTTPS, an uptime monitor is active, and a rollback has been tested.

## 11. Open Issues

- Final choice of domain extension and renewal plan.
- Choice of LLM provider and monthly spending limit.
- Whether a public downloadable CV is shown to visitors.
- Whether a contact form is required or a mailto link is enough.

# AI-IGMS Pre-Review Audit and Remediation Status

**Audit date:** 2026-10-14  
**Repository inspected:** `24cs73-prince/AI_IGMS`, current checkout on `main`  
**HEAD:** `04309dc` (`feat(dashboard): label fallback records as sample data`)  
**Working tree at audit start:** clean  
**Baseline audit mode:** source review and safe local checks only. The findings below record the state before remediation began.

> The pasted audit prompt names `24cs73-prince/CS26001-AI_IGMS`; this report covers the open workspace `24cs73-prince/AI_IGMS`. Confirm that this is the intended repository before relying on the findings for the other repository.

> **Status note:** Sections 1–15 are the historical baseline audit and prioritized plan, not a description of the current working tree. See [Remediation status](#16-remediation-status) for implemented changes, current validation, and remaining risks.

## 1. Baseline executive summary

**Review readiness: not ready for a real school deployment or a security-focused project review.** The frontend builds, and all 98 backend JavaScript files pass `node --check`. However, static inspection found several confirmed, blocking problems:

- Multiple student, teacher, and principal APIs allow unauthenticated reads or writes. Exam keys, submissions, and CSV result exports are also exposed without authentication.
- The student exam submission API trusts the submitted student identifier and allows repeated submissions; it does not enforce exam availability or deadlines.
- Parent data isolation is incomplete: parent attendance/marks requests without a student ID return school-wide records, and the children endpoint can substitute an unrelated first student.
- Production authentication has a hard-coded fallback JWT signing secret and built-in demo credentials; public seed/sample-account endpoints are enabled.
- Student/teacher/parent/principal creation responses include plaintext login passwords.
- The password-change UI does not persist a password to the backend and does not correctly verify the current password.
- The committed backend lockfile contains unresolved Git conflict markers, so npm audit/install workflows cannot use it.
- The frontend converts API errors into sample data or success-shaped exam results; the AI service silently substitutes generated fallback questions.

The baseline audit did **not** connect to MongoDB, start the backend, call a live API, use real accounts, run destructive scripts, or manually exercise the browser UI. Runtime persistence, deployment configuration, role-level workflows, and visual/mobile behavior therefore remained unverified. The root package audit found two moderate React Router advisories. No fixes had been made at the time of that baseline; remediation is summarized in section 16.

## 2. Repository structure and architecture

- **Frontend:** React 18 / Vite application in `src/`; route definitions are in `src/routes/AppRoutes.jsx`. API helpers are in `src/services/api.js` and `src/services/onlineExamService.js`.
- **Backend actually started by `npm run server`:** `server/server.js`, Express routes under `server/routes/`, controllers under `server/controllers/`, Mongoose models under `server/models/`.
- **Second backend implementation:** tracked files under `server/src/` have a separate, substantially different Express/auth implementation. `server/package.json` starts `server/server.js`, not `server/src/server.js`. The latter is not part of the inspected active startup path.
- **Database (at baseline):** active backend used `server/config/db.js`; exam create/update/delete also called `server/config/dualDbWriter.js`. That dual-writer module has since been removed.
- **Data and reports:** static/example data remains in `src/data/`, in frontend service defaults, and in `server/config/seedAllData.js`.
- **Deployment:** `vercel.json` provides an SPA rewrite; the frontend Vite config proxies `/api` to `localhost:5000` during development. No Render service manifest or backend deployment health configuration was identified.
- **Route/page inventory:** 43 JSX page modules exist. Several old/general pages are not imported by `AppRoutes.jsx` (including the standalone `Examination`, `Results`, `Reports`, AI `QuestionPaper`/`PerformanceAnalysis`, and `CreateExamPage` implementations); the My Class path redirects rather than rendering `MyClass`. These may be stale or intentionally superseded, but their intended status is undocumented.

## 3. Confirmed findings

Severity values use **Critical / High / Medium / Low**. Confidence uses **Confirmed / Probable / Needs verification**. Reproduction below is for an isolated local test database or test build only; do not use production student data.

### Security

| ID | Severity / confidence | Location | Finding and evidence | Safe reproduction | Impact and recommended fix | Regression test / dependencies |
|---|---|---|---|---|---|---|
| SEC-001 | **Critical / Confirmed** | `server/routes/studentRoutes.js`, `teacherRoutes.js`, `principalRoutes.js`; corresponding controllers | Student and teacher list/create routes have no `protect` middleware; principal list/create/delete routes also have no authentication or role guard. Student/teacher create handlers create login accounts. In addition, `/api/auth/seed` and `/api/auth/add-sample-teacher` are public. | Against a disposable local DB, call the list/create/delete routes and auth seed/sample routes with no `Authorization` header; verify writes and returned data. | Any remote caller can enumerate school records, create accounts, or delete principal records; the seed endpoint can create known-role accounts. Add server-side auth and least-privilege role checks to every non-public route; disable seed/demo endpoints outside a controlled development setup. | API tests for 401/403 on every route and successful authorized operations. Must precede role-isolation testing. |
| SEC-002 | **Critical / Confirmed** | `server/routes/examRoutes.js`, `server/controllers/examController.js`, `server/routes/submissionRoutes.js` | `GET /api/exams`, `GET /api/exams/:id`, `GET /api/exams/:id/submissions`, and `GET /api/exams/:id/export-csv` are public. The exam model stores `correctAnswer`, and exam GET handlers return the whole exam document. | In local test data, request an exam as an unauthenticated client and inspect the response for `questions[].correctAnswer`; request submissions/export without a token. | Anyone can retrieve answer keys and student results, including before publication. Add role/ownership checks and a student-safe exam serializer that never returns answer keys before allowed release; gate results by publication and ownership. | Tests for no-key student exam responses, 401/403 submissions/export, and unpublished-result denial. |
| SEC-003 | **Critical / Confirmed** | `server/routes/submissionRoutes.js`; `server/controllers/submissionController.js` | `POST /api/exams/:id/submit` is unauthenticated. The controller accepts client-provided `studentId` and `studentName` (with hard-coded identity defaults), keys submissions by those values, and updates an existing submission on repeat. | On a disposable exam, submit answers first with one chosen student ID and then resubmit with the same ID/different answers; also try another ID. | A caller can impersonate a student, overwrite that student's attempt, and submit without a verified account. Bind student identity to `req.user`; enforce one allowed attempt (or explicit policy) and validate exam status/timing server-side. | Tests for missing token, spoofed ID, duplicate attempt, cross-class exam, and deadline rejection. Depends on SEC-001/002. |
| SEC-004 | **Critical / Confirmed** | `server/controllers/attendanceController.js`, `markController.js`, `parentController.js`, `server/routes/parentRoutes.js` | Parent restrictions run only when `studentId` is supplied in attendance/marks queries. Without it, the controllers return all matching attendance or marks documents. `/api/parents/my-children` is accessible to any authenticated role and falls back to `Student.findOne()` when no child matches. The attendance parent-isolation catch also logs and continues. | With a test parent token, omit `studentId` from `/api/attendance` and `/api/marks`; use a parent with no valid link for `/api/parents/my-children`. | Exposes unrelated students' attendance, marks, or profile data. Restrict `/my-children` to parents, derive the allowed child IDs from trusted relationships, always constrain parent queries, return no children for missing links, and fail closed on relationship lookup errors. | Tests for linked, unlinked, and cross-child IDs; omitted IDs must not broaden access. |
| SEC-005 | **High / Confirmed** | `server/controllers/authController.js`, `server/middleware/authMiddleware.js` | Token signing and verification both default to a fixed JWT secret if `JWT_SECRET` is absent. Built-in demo identities/passwords are used by login fallback, and middleware reconstructs those identities from a valid token even if no DB user exists. The fallback is not disabled in production. | In an isolated environment without `JWT_SECRET`, verify that the application accepts the built-in credentials and that a token signed with the source fallback value is accepted for the corresponding seeded identity. | Predictable tokens and public demo accounts can grant elevated access. Require a strong secret at startup in every environment; remove production fallback identities and known credentials; seed only via a protected, explicit, one-time administrative operation. Rotate any secret if it has ever been used. | Startup test must fail without secret; production login/token tests must reject demo identities. |
| SEC-006 | **High / Confirmed** | `server/controllers/studentController.js`, `teacherController.js`, `parentController.js`, `principalController.js` | Each create handler returns `loginPassword` in its JSON response. Password values are also accepted/defaulted by those handlers. | Create a test user using a dedicated DB and inspect the successful response body. | Plaintext credentials can be retained in logs, browser devtools, monitoring, or proxies. Never return a password; provide a controlled credential-reset/activation flow. Ensure credentials are not logged. | Assert create responses contain no password or hash; audit logging and client flows. |
| SEC-007 | **High / Confirmed** | `server/config/dualDbWriter.js` | A tracked default Atlas connection URI exists in source (its value is intentionally not reproduced here). Exam mutations also write to Atlas and local MongoDB with `Promise.allSettled`; write/delete failures are swallowed/logged and do not fail the API response. | Review the tracked source/config without printing the URI; in a disposable environment inject a failing secondary DB and observe the API response vs. persistence. | If the embedded URI is live, treat it as compromised and rotate it. The dual-write design can report success while replicas diverge and sends data to two DBs implicitly. Remove connection credentials from code, use environment-only secrets, establish one source of truth, and surface failed persistence explicitly. | Verify no credential in tracked code/history; tests for secondary-write failure and replica consistency. History scan not performed. |
| SEC-008 | **High / Confirmed** | `src/context/AuthContext.jsx`, `src/pages/ChangePassword.jsx`, `server/controllers/authController.js` | Frontend `changePassword` only updates local state/storage, does not call `/api/auth/change-password`, and checks `hashPassword(currentPassword) === user.passwordHash` even though the backend login response omits `passwordHash`. Thus normal backend sessions can accept any current password locally, while the actual server password remains unchanged. The backend endpoint can also return a success response if the user lookup returns no DB user. | With a disposable account, change password in the UI using an incorrect current value, log out, then attempt login with the new and old values; inspect endpoint behavior separately. | Users are misled into believing credentials changed; client-side current-password validation is not authentication. Implement the change through the protected API, validate/hash server-side, require the user record to exist, and return success only after persistence. | Integration tests for wrong current password, password persistence after relogin, and missing DB user. |
| SEC-009 | **High / Confirmed** | `server/controllers/markController.js`, `attendanceController.js`, `classController.js`, `timetableController.js`, `schoolController.js`; related routes | Role checks are not equivalent to school/record ownership. Attendance/mark reads and writes accept client-selected school/class values; general authenticated reads are often unscoped. School roster requires only any authenticated account. Exam mutation/evaluation likewise checks a broad role but not the owning school or exam creator. | With two isolated school fixtures, access or mutate the second school's data using a token from the first. | Cross-school data exposure and unauthorized changes. Derive school scope from the authenticated user and enforce it in each query/mutation; super-admin bypass should be explicit. | Multi-school authorization integration suite. Depends on role model/relationship data being made consistent. |
| SEC-010 | **High / Confirmed** | `server/routes/aiRoutes.js`, `server/controllers/aiController.js`, `server/utils/grokAi.js` | Both AI routes use optional authentication, have no route-specific rate limit, and accept unbounded counts/strings. A performance prompt includes the supplied student name and score data and is sent to an external AI provider when configured. | In local/mock mode call AI endpoints without a token and submit a very large question count; use a mocked provider to inspect outbound prompt fields. | Anonymous callers can consume paid provider resources; student-identifying performance data can leave the service without an identified privacy/consent policy. Require authenticated roles, bounded input/timeouts/rate limits, and minimize or anonymize provider payloads. | Mocked provider tests for limits/errors and privacy-safe prompts; provider calls not made during this audit. |
| SEC-011 | **Medium / Confirmed** | `server/utils/exportExcel.js`; public export route in `server/routes/submissionRoutes.js` | CSV cells are wrapped in quotes but values are not escaped for embedded quotes or spreadsheet formula prefixes. User-controlled student name/ID/remarks may therefore create malformed CSV or formula-injection cells. | In a test DB export a result whose name begins with `=`, `+`, `-`, or `@` and open only in a safe text viewer/spreadsheet sandbox. | Export consumers may execute formulas or misparse columns. Escape embedded quotes and neutralize formula-leading values; protect the export endpoint as SEC-002. | Unit tests for quoting, commas, newlines, and formula-leading values. |

### Functional, data integrity, and build findings

| ID | Severity / confidence | Location | Finding and evidence | Safe reproduction | Impact and recommended fix | Regression test / dependencies |
|---|---|---|---|---|---|---|
| BUG-001 | **High / Confirmed** | `src/services/api.js`, `src/services/onlineExamService.js` | API errors/non-2xx responses are caught and converted to fallback values. Student/teacher list calls substitute hard-coded sample records when the backend returns an empty list or fails. Exam create/publish/result-publish/submit can return fabricated local/success-shaped values when persistence fails. | Mock fetch to return 500 or reject; compare the returned data/state with a successful empty API response. | UI can show sample students or claim an exam/result was created, submitted, or published when it was not. Preserve the distinction between empty, failed, and demo data; report failures explicitly and make demo mode clearly labeled/opt-in. | Service tests for 200-empty, 401/500, network failure, and persisted mutations. |
| BUG-002 | **High / Confirmed** | `server/package-lock.json` | The tracked lockfile contains literal `<<<<<<<`, `=======`, and `>>>>>>>` conflict markers near the root dependency list and inside package metadata. `npm audit --prefix server --omit=dev --audit-level=moderate` fails with `ENOLOCK`/`loadVirtual` instead of auditing dependencies. | Run the backend audit command from `server/`; parse the lockfile as JSON or run `npm ci` in a clean disposable worktree. | Backend dependency resolution/audit is not reproducible from this lockfile; clean installs may fail. Regenerate the lockfile from the intended `server/package.json` dependencies and verify a clean install. | Clean-worktree `npm ci`, package audit, backend startup with test DB. |
| BUG-003 | **Medium / Confirmed** | `src/services/onlineExamService.js`, `server/controllers/examController.js`, `server/middleware/validateMiddleware.js` | Exam creation defaults missing questions/options/correct answer to fabricated placeholders (including answer index 0); supplied `totalMarks` and `totalQuestions` are not checked against the question array or marks sum. The grader totals question marks, not the exam's declared total. | Create a test exam with mismatched totals, missing options, or invalid answer indexes; evaluate a mock submission and compare declared/graded totals. | Incorrect or misleading question papers and scores. Validate each question, option count, answer index, count, marks, and aggregate totals before save; return validation errors rather than inventing defaults. | Unit/API validation and grading tests. |
| BUG-004 | **Medium / Confirmed** | `server/controllers/submissionController.js`, `src/pages/student/StudentExamAttemptPage.jsx` | Attempt timer is client-side only. The API does not enforce `startDate`, `endDate`, `durationMinutes`, exam publication status, or results publication when submitting/reading. | With a test exam, submit after `endDate` or `status: Draft` directly to the API; bypass the browser timer. | Students can attempt outside the intended window and access unpublished exam/result data. Enforce lifecycle rules and authoritative start/deadline timestamps on the server. | Time-bound API integration tests with a controllable clock. |
| BUG-005 | **Medium / Confirmed** | `server/controllers/attendanceController.js` | For a requested student with no recorded row in a class/date set, the response synthesizes status `"Present"`; empty history sets `totalDays` to 1 and computes an attendance percentage of 0 rather than representing no data. | Query an unknown/non-enrolled student ID in a test DB with no matching attendance rows. | Incorrect attendance history/percentage can affect decisions. Return only actual recorded rows and represent no data as zero days/`null` percentage. | Unit tests for absent record, zero days, and valid attendance. |
| BUG-006 | **Medium / Confirmed** | `server/config/db.js`, `server/config/dualDbWriter.js`, `server/server.js` | Missing DB configuration falls back to local MongoDB; `connectDB` auto-seeds sample records after every successful connection when collections are empty, without a development-only gate. The dual writer additionally targets a second configured/default DB. | In disposable isolated DBs, omit Mongo env configuration and observe selected DB/seed behavior; do not run this against production. | Misconfiguration may target local data unexpectedly, and a production DB can be populated with sample school/student records. Require explicit DB config in production and gate seed data behind an explicit development/seed command. | Startup tests for missing env and seed-disabled production; test DB only. |
| BUG-007 | **Medium / Confirmed** | `package.json` and `server/package.json` | Root `npm start` runs `vite` (development server); `dev:all` runs only the backend, not both services. There is no root `test` or lint script. README describes an earlier frontend-only/mock architecture and demo credentials, not the current full-stack routes/services. | Inspect scripts and attempt supported start/test commands in a local environment (do not start server without an isolated DB). | Operators may deploy/run the wrong process and reviewers may follow stale setup instructions; automated validation coverage is unclear. Document separate frontend/backend dev and production commands, and update README to match current behavior. | Verify documented commands against clean installs and deployment target. |
| BUG-008 | **Low / Confirmed** | `src/pages/ChangePassword.jsx`, `src/i18n/translations.js` | The password-change screen uses hard-coded English labels/messages and does not consume the language context, unlike the bilingual login flow. | Switch the app language to Gujarati and open Change Password. Browser interaction was not run; source inspection shows no translation hook. | Bilingual users see mixed-language UI. Add translations for labels, validation, notifications, and buttons. | Component checks in English and Gujarati. |
| BUG-009 | **Medium / Confirmed** | `src/services/api.js`; corresponding page components | Frontend service methods are a hybrid of backend calls and dummy fallbacks/default field values. In particular, the service comment claims all authenticated-portal data is database-driven but `getStudents`/`getTeachers` substitutes hard-coded data on empty/error responses. Several create methods return `null` on failure without a consistent error result. | Mock an empty API response/failure and inspect each consumer's empty/error state. | Staff can mistake sample/default values for live records; failed actions can be silent or ambiguous. Use explicit API result/error types and empty/error UI states; only inject fixtures in an explicitly labeled demo mode. | Service and page tests for loading/error/empty/data states. |
| BUG-010 | **Medium / Confirmed** | `server/config/dualDbWriter.js` | Secondary upserts/deletes catch errors and `Promise.allSettled` always resolves, while controller responses may report success. The claimed “guarantees zero delay” comment is not backed by atomic replication or a durability policy. | Mock one DB unavailable and verify one write succeeds while the API still returns success. | Atlas/local collections may diverge silently and operators cannot tell which DB is authoritative. Replace dual writes with an explicit single-write/queue/transaction strategy or return a visible partial-failure status. | Fault-injection persistence tests. |

### Finding line anchors

The table above uses concise file references; these anchors identify the relevant code locations.

| Finding | File and line anchors |
|---|---|
| SEC-001 | `server/routes/studentRoutes.js:6`; `server/routes/teacherRoutes.js:6`; `server/routes/principalRoutes.js:10-11`; `server/routes/authRoutes.js:15-16`; account response examples: `server/controllers/studentController.js:103`, `teacherController.js:81`, `principalController.js:84` |
| SEC-002 | `server/routes/examRoutes.js:15,19`; full exam response: `server/controllers/examController.js:83-89`; exposed results: `server/routes/submissionRoutes.js:18,27` |
| SEC-003 | `server/routes/submissionRoutes.js:15`; `server/controllers/submissionController.js:14-49` |
| SEC-004 | `server/routes/parentRoutes.js:15`; `server/controllers/parentController.js:43-66`; `server/controllers/attendanceController.js:61-111`; `server/controllers/markController.js:63-104` |
| SEC-005 | `server/controllers/authController.js:7-8,19-86,130-160`; `server/middleware/authMiddleware.js:5,100-129` |
| SEC-006 | `server/controllers/studentController.js:103`; `teacherController.js:81`; `parentController.js:158`; `principalController.js:84` |
| SEC-007 | `server/config/dualDbWriter.js:11,54-94,100-118` |
| SEC-008 | `src/context/AuthContext.jsx:196-237`; `src/pages/ChangePassword.jsx:29-39`; `server/controllers/authController.js:211-226` |
| SEC-009 | `server/routes/schoolRoutes.js:21`; `server/controllers/attendanceController.js:20-45,79-111`; `markController.js:13-49,57-104`; `classController.js` and `timetableController.js` read/write handlers |
| SEC-010 | `server/routes/aiRoutes.js:15-16`; `server/controllers/aiController.js:40-43`; `server/utils/grokAi.js:27,43,234,258` |
| SEC-011 | `server/utils/exportExcel.js:22-36`; `server/routes/submissionRoutes.js:27` |
| BUG-001 | `src/services/api.js:31,34,59-60,111-112`; `src/services/onlineExamService.js:146,154,179-203` |
| BUG-002 | `server/package-lock.json:15-38`; additional conflict markers are present throughout the lockfile through line 1705 |
| BUG-003 | `src/services/onlineExamService.js:85-125`; `server/controllers/examController.js:27-48`; `server/middleware/validateMiddleware.js:4-25` |
| BUG-004 | `server/controllers/submissionController.js:14-49`; `src/pages/student/StudentExamAttemptPage.jsx:48-49` |
| BUG-005 | `server/controllers/attendanceController.js:86-111` |
| BUG-006 | `server/config/db.js:9-17,26,33-43`; sample insert guards are in `server/config/seedAllData.js` |
| BUG-007 | Root `package.json` scripts; `server/package.json` scripts; `README.md` |
| BUG-008 | `src/pages/ChangePassword.jsx:60-94`; `src/context/AuthContext.jsx:196-237` |
| BUG-009 | `src/services/api.js:31-60,111-112`; `src/services/onlineExamService.js:146,154,179-203` |
| BUG-010 | `server/config/dualDbWriter.js:54-94,100-118` |

## 4. Potential bugs requiring runtime verification

These are not reported as confirmed runtime failures because no test DB or running application was used:

- Direct navigation, browser refresh, responsive layout, keyboard/screen-reader operation, modal focus handling, and real browser-console/request failures across the routed pages.
- Full data persistence and consistency across create/edit/list workflows for students, teachers, parents, schools, classes, attendance, timetable, marks, notices, meals, holidays, and leaves.
- Whether the configured MongoDB data currently contains actual personal data, duplicate records, or mismatched school IDs.
- AI-provider response shape, real model availability, timeout behavior, output language/curriculum quality, and the provider's handling of student data. The source contains mock/fallback generation, but a live provider was not called.
- Production CORS, host/API URL, environment-variable provisioning, health-check behavior, SPA fallback on the actual deployment host, and cold-start behavior.
- Database write races/duplicate attendance records; current attendance schema has no unique compound index, and read-then-create is not atomic.
- Authentication behavior with an actual provisioned user and a dedicated test DB.

## 5. Critical and high-severity security findings

SEC-001 through SEC-010 are the release blockers. Prioritize in this order:

1. Close unauthenticated mutation/listing surfaces, especially account creation and principal deletion (SEC-001).
2. Protect exam papers, submissions, exports, and bind attempts to authenticated student identities (SEC-002/003).
3. Enforce parent and school-level isolation on every query, including omitted-filter cases (SEC-004/009).
4. Remove production demo accounts and fixed-secret JWT fallback (SEC-005); remove password values from API responses (SEC-006).
5. Remove/rotate any live credential in tracked source and make persistence failures explicit (SEC-007).
6. Fix password-change flow and anonymous AI resource/privacy risks (SEC-008/010).

No destructive attack or attempt to access unrelated live data was performed. A complete Git-history secret scan was not completed; treat the tracked Atlas URI as potentially exposed until its validity and history are checked.

## 6. Frontend page-by-page audit

The following is a **route/module inventory**, not a claim that every interactive control has passed a browser test. Build passed; no frontend server/browser test was run.

| Page/module | Route / current status | Static-review result |
|---|---|---|
| `pages/auth/Login.jsx` | `/login` | Backend-first login plus development/local fallback. UI pre-fills demo credentials; production backend must not accept demo credentials. |
| `pages/public/AboutDepartment.jsx` | `/about-department` | Public route; interactions and assets not browser-tested. |
| `pages/public/GovServices.jsx` | `/services` | Public route; interactions and responsive behavior not browser-tested. |
| `pages/public/GovSchoolsDirectory.jsx` | `/schools-directory` | Public route; data-source/runtime behavior not browser-tested. |
| `pages/public/ContactUs.jsx` | `/contact-us` | Public route; form submission/runtime behavior not browser-tested. |
| `pages/Dashboard.jsx` | `/dashboard` | Protected for super-admin/principal/admin; data aggregation/runtime not verified. |
| `pages/Students.jsx` | `/students` | Admin/principal route; uses service layer with sample fallback risk (BUG-001/009). |
| `pages/Teachers.jsx` | `/teachers` | Admin/principal route; uses service layer with sample fallback risk (BUG-001/009). |
| `pages/Parents.jsx` | `/parents` | Admin/principal route; backend relationship/access behavior not runtime-tested. |
| `pages/Schools.jsx` | `/schools` | Super-admin/admin route; backend school ownership not enforced consistently (SEC-009). |
| `pages/Principals.jsx` | `/principals` | Frontend route protected; corresponding backend principal APIs are public (SEC-001). |
| `pages/principal/PrincipalLeaves.jsx` | `/principal/leaves` | Protected page; approval/persistence workflow not tested. |
| `pages/Attendance.jsx` | Not registered in `AppRoutes.jsx` | Orphan/legacy page; not reachable through declared router. |
| `pages/teacher/MarkAttendance.jsx` | `/teacher/attendance` | Protected frontend route; API school scope and missing-row attendance bug (SEC-009/BUG-005). |
| `pages/teacher/UploadMarks.jsx` | `/teacher/marks` | Protected frontend route; API role scope exists but school/parent isolation is incomplete (SEC-009/SEC-004). |
| `pages/teacher/ApplyLeave.jsx` | `/teacher/leave` | Protected route; workflow not runtime-tested. |
| `pages/teacher/TeacherDashboard.jsx` | `/teacher/dashboard` | Protected route; data/empty/error states not browser-tested. |
| `pages/teacher/AIPaperGenerator.jsx` | `/teacher/ai-generator`, `/teacher/exams/create` | Active exam generator; fallback and validation concerns (BUG-001/003). |
| `pages/teacher/TeacherExamsPage.jsx` | `/teacher/exams` | Active; server exam list leaks answer keys through API (SEC-002). |
| `pages/teacher/ExamDetailsPage.jsx` | `/teacher/exams/:examId` | Active; ownership and database behavior not runtime-tested. |
| `pages/teacher/StudentSubmissionsPage.jsx` | `/teacher/exams/:examId/submissions` | Active; submissions endpoint is public (SEC-002). |
| `pages/teacher/TeacherResultsPage.jsx` | `/teacher/exams/:examId/results` | Active; publish/export authorization and persistence concerns (SEC-002/BUG-001). |
| `pages/teacher/CreateExamPage.jsx` | Not registered/imported by `AppRoutes.jsx` | Orphan/legacy implementation; not reachable. |
| `pages/teacher/MyClass.jsx` | `/teacher/my-class` redirects to dashboard | Component itself is not rendered by its path; intended feature status unclear. |
| `pages/student/StudentDashboard.jsx` | `/student/home` | Protected frontend route; API authorization still required. |
| `pages/student/StudentExamsPage.jsx` | `/student/exams` | Active; exam listing and submissions are not student-isolated server-side (SEC-002/003). |
| `pages/student/StudentExamStartPage.jsx` | `/student/exams/:examId/start` | Active; exam key may be included in fetch response (SEC-002). |
| `pages/student/StudentExamAttemptPage.jsx` | `/student/exams/:examId/attempt` | Active; timer is client-side and submission identity comes from client state (SEC-003/BUG-004). |
| `pages/StudentResults.jsx` | `/student/results` | Protected frontend route; published-result enforcement not verified and server endpoints are open (SEC-002). |
| `pages/StudentAttendance.jsx` | `/student/attendance` | Protected frontend route; backend access still relies on weak query scoping (SEC-004). |
| `pages/ParentDashboard.jsx` | `/parent/dashboard` | Protected frontend route; parent child selection/data isolation needs correction (SEC-004). |
| `pages/ParentResults.jsx` | `/parent/results` | Protected frontend route; parent marks isolation fails when student filter omitted (SEC-004). |
| `pages/ParentAttendance.jsx` | `/parent/attendance` | Protected frontend route; parent attendance isolation fails when student filter omitted (SEC-004). |
| `pages/ParentMidDayMeal.jsx` | `/parent/mid-day-meal` | Protected frontend route; API data and localization not browser-tested. |
| `pages/Notices.jsx` | `/notices`, `/student/notices`, `/parent/notices` | Shared page; endpoint GET is public; role-specific notice behavior not runtime-tested. |
| `pages/Timetable.jsx` | `/teacher/timetable` | Protected frontend route; backend is authenticated but not school-scoped (SEC-009). |
| `pages/Examination.jsx` | Not registered/imported by `AppRoutes.jsx` | Orphan/legacy page; current online exams use teacher/student pages. |
| `pages/Results.jsx` | Not registered/imported by `AppRoutes.jsx` | Orphan/legacy page. |
| `pages/Reports.jsx` | Not registered/imported by `AppRoutes.jsx` | Orphan/legacy page; export/report behavior not runtime-tested. |
| `pages/ai/QuestionPaper.jsx` | Not registered/imported by `AppRoutes.jsx` | Orphan/legacy AI page. |
| `pages/ai/PerformanceAnalysis.jsx` | Not registered/imported by `AppRoutes.jsx` | Orphan/legacy AI page. |
| `pages/ChangePassword.jsx` | `/change-password` | Functional/security defect in SEC-008; English-only text (BUG-008). |

Shared layouts/components, tables, search, pagination, chart interactions, toast/modal behavior, responsive breakpoints, accessible names/focus, and Gujarati coverage were not exhaustively browser-tested. The successful Vite build confirms compilation only, not UI correctness.

## 7. Backend API-by-API inventory

“Protected” below means route-level JWT middleware is present; it does **not** imply record ownership or school isolation. All findings are source-level; no API integration tests ran.

| Method / endpoint | Auth / role in route | Handler / notable defect |
|---|---|---|
| `POST /api/auth/login` | Public | `loginUser`; built-in demo fallback and fixed-secret risk (SEC-005). |
| `POST /api/auth/seed` | Public | Seeds known role accounts; must not be public in production (SEC-001/005). |
| `POST /api/auth/add-sample-teacher` | Public | Creates/defaults a teacher account; SEC-001. |
| `GET /api/auth/me` | JWT | `getMe`; DB-missing path returns middleware user. |
| `POST /api/auth/change-password` | JWT | Server handler exists, but UI does not call it; SEC-008. |
| `GET /api/exams`, `GET /api/exams/:id` | Public | Returns full exam documents including answer keys (SEC-002). |
| `POST /api/exams` | Teacher/principal/super-admin | Create; question/count/marks validation incomplete (BUG-003); no school ownership (SEC-009). |
| `PUT /api/exams/:id` | Teacher/principal | Update; mass assignment from request body and no ownership check (SEC-009). |
| `PATCH /api/exams/:id/publish` | Teacher/principal | Publish; no school/creator ownership. |
| `DELETE /api/exams/:id` | Teacher/principal/super-admin | Delete; no ownership check; dual delete failure is hidden (BUG-010). |
| `POST /api/exams/:id/submit` | Public | Trusts client identity; repeat overwrites; no time/status checks (SEC-003/BUG-004). |
| `GET /api/exams/:id/submissions` | Public | Exposes student results (SEC-002). |
| `POST /api/exams/:id/evaluate` | Teacher/principal | No school/exam ownership check (SEC-009). |
| `PATCH /api/exams/:id/publish-results` | Teacher/principal | No school/exam ownership check; returns full exam. |
| `GET /api/exams/:id/export-csv` | Public | Exposes result export; CSV injection risk (SEC-002/011). |
| `GET/POST /api/students` | Public / Public | Exposes and creates student records/accounts (SEC-001/006). |
| `GET/POST /api/teachers` | Public / Public | Exposes and creates teacher records/accounts (SEC-001/006). |
| `GET/POST/DELETE /api/principals[/:id]` | Public / Public / Public | Principal enumeration/create/deletion (SEC-001); plaintext credentials (SEC-006). |
| `GET /api/schools`, `GET /api/schools/:id` | Public | School data publicly enumerable. |
| `POST /api/schools` | Super-admin | Create school; no multi-school transaction guarantee for user + school. |
| `PATCH /api/schools/:id` | Super-admin/principal | No principal-to-school ownership enforcement (SEC-009). |
| `GET /api/schools/:id/roster` | Any JWT user | No role or school ownership check (SEC-009). |
| `/api/parents/my-children`, parent reads | Any JWT on reads | `/my-children` not parent-role restricted and falls back to arbitrary child (SEC-004). |
| Parent create/update/delete | Super-admin/principal/admin | Create returns plaintext password; school ownership not checked (SEC-006/009). |
| `GET/POST /api/attendance` | JWT / teacher or principal | Parent query can omit student ID to get all records; write school is client-selected/defaulted (SEC-004/009); missing history synthesizes Present (BUG-005). |
| `GET/POST /api/marks` | JWT / teacher or principal | Parent query can omit student ID to get all marks; write school is client-selected/defaulted (SEC-004/009). |
| `/api/classes`, `/api/subjects`, `/api/timetable` | JWT reads; admin/principal writes | Role checks exist for writes; no consistent school scoping (SEC-009). |
| `/api/student-parents` | JWT read; admin/principal writes | Authenticated users can enumerate relationships; no school filter. |
| `/api/notices` | Public read; principal/super-admin write | Public list; no tenant filtering. |
| `/api/leave` | JWT read; teacher create; principal/super-admin status update | No school ownership enforcement. |
| `/api/meals`, `/api/holidays` | Public read; admin/principal writes | Public read appears intentional; mutations need school scoping. |
| `/api/ai/generate-questions`, `/api/ai/analyze-performance` | Optional JWT | Anonymous/provider-consuming endpoints; unbounded input and student data sent externally (SEC-010). |
| `GET /api/health` | Public | Reports static health payload; does not expose DB readiness. |

Other route modules are `classRoutes`, `subjectRoutes`, `studentParentRoutes`, `timetableRoutes`, `mealRoutes`, `holidayRoutes`, `noticeRoutes`, and `leaveRoutes`. Route declarations were reviewed; route handlers were not all exercised against a database.

## 8. Database and data integrity findings

- Student IDs and teacher IDs have unique model indexes; `StudentParent` has a compound unique index. Attendance and marks records do not have equivalent unique class/date or class/subject/term constraints, and controller read-then-create/update paths can race.
- Attendance and marks `school_id` defaults are hard-coded; several controllers accept client-selected `school_id`, and many queries do not filter by authenticated school (SEC-009).
- Student/teacher creation writes the domain record and user account separately without a transaction. A failure between writes can leave orphaned/partial records. Parent creation also creates user/profile/relationship records sequentially.
- `server/config/dualDbWriter.js` directly writes whole documents to separately created Mongo connections. Replica failures are swallowed; the primary Mongoose operation can succeed while Atlas/local copies diverge (SEC-007/BUG-010).
- `server/config/db.js` silently chooses a local DB when configured URIs are absent and calls `seedAllData()` after connecting. Do not use the seed/clear/sync/restore scripts on a production DB without approval and a verified backup.
- `server/db_backup.json` is tracked. Whether its content is synthetic or real and whether it contains personal data was not determined; review it under the project's data-handling policy before distribution.
- The `.gitignore` excludes `.env` files, but current tracked code still contains a default Atlas URI in the dual writer. A history-wide credential scan remains outstanding.

## 9. Authentication and role-permission findings

- Frontend route guards are not an authorization boundary. `AuthContext` restores a user object from local storage, while some backend routes have no authentication at all (SEC-001).
- Login stores JWT in `localStorage`; XSS would expose bearer tokens. No cookie/CSRF design is present. No `dangerouslySetInnerHTML` use was found in the targeted source search, but full XSS review was not completed.
- Fixed JWT fallback and built-in seed accounts remain active in production paths (SEC-005). `User.matchPassword` also retains a base64 password-comparison fallback for legacy hashes; base64 is reversible and should not be treated as password hashing.
- Role allowlists often omit the actual school/record ownership check (SEC-009). Parent-only endpoints do not consistently require the parent role (SEC-004).
- Invalid/expired JWT rejection is implemented through `jwt.verify`, but was not exercised at runtime.
- Password change is broken as described in SEC-008.

## 10. Examination and AI-generation findings

- Answer keys are embedded in `Exam.questions` and returned by public exam GET endpoints (SEC-002).
- Submission accepts client student identity, can overwrite a previous attempt, and does not check schedule, status, class eligibility, or duration server-side (SEC-003/BUG-004).
- Result listing/export is public; results publication state is not enforced by the public GET endpoints (SEC-002).
- Server-side grading does compare submitted option indices with the saved key. However, question validation/defaulting and aggregate marks checks are inadequate (BUG-003).
- AI generation calls Grok/Groq from the backend using environment keys, not from the frontend bundle. But output can be replaced by a local deterministic generator when provider calls fail or no key is configured; response still reports success (`Smart-Fallback-AI`). This contradicts the desired explicit provider failure behavior and can misrepresent fabricated questions as AI output.
- AI endpoints are optional-auth and unbounded (SEC-010). The performance-analysis prompt includes a student name and performance fields; external data processing/privacy requirements are not documented.
- No AI calls were made during the audit.

## 11. UI, accessibility, responsiveness, localization findings

- Vite compilation passed; no route-by-route browser rendering, console/network inspection, keyboard, screen-reader, or viewport tests were performed.
- Login has English/Gujarati strings, but Change Password is English-only (BUG-008). Other page-level localization completeness remains unverified.
- The standalone legacy/general pages noted in the frontend inventory are unreachable via `AppRoutes`; clarify whether they should be removed, routed, or documented as retired.
- API fallback data can make empty/error states look populated; ensure sample records are visibly labeled and never presented as live school records (BUG-001/009).
- Accessibility contrast, focus trapping, focus return, form error announcements, table semantics, and mobile overflow remain unverified.

## 12. Build, test, and dependency audit results

| Check | Result | Evidence / limitation |
|---|---|---|
| `npm run build` | **Passed with warning** | Vite 5.4.21 transformed 487 modules. Minified JS chunk is 685.30 kB (>500 kB warning). |
| Backend syntax | **Passed** | `node --check` passed for all 98 `server/**/*.js` files. This is syntax-only; it does not start the server. |
| Root scripts | **Inspected** | `npm run` shows dev/build/preview/start/server/dev:all only; no test or lint script. `start` runs Vite; `dev:all` is actually only the backend. |
| Root production dependency audit | **Failed with findings** | `npm audit --omit=dev --audit-level=moderate`: two moderate React Router advisories through `react-router-dom`: backslash-based open redirect (GHSA-wrjc-x8rr-h8h6) and constructor injection in SSR hydration (GHSA-337j-9hxr-rhxg). `npm audit` suggested a fix; no package changes were made. SSR-specific applicability is unverified. |
| Backend dependency audit | **Blocked** | `npm audit --omit=dev --audit-level=moderate` from `server/` fails because `server/package-lock.json` has unresolved merge conflict markers (BUG-002). |
| Automated tests | **Not run / no configured runner** | No `test` script is configured. `server/scripts/testSecurity.js`, `testChildIsolation.js`, and `testAllApis.js` are ad-hoc HTTP scripts, default to localhost, use credentials that do not match current seed accounts, mostly log statuses instead of asserting/setting failure exit codes, and were not run. |
| Database/API integration | **Not run** | Would require a dedicated isolated test DB. Active server startup connects to MongoDB and runs seed behavior; no live or production DB was touched. |
| Browser/UI tests | **Not run** | No dev server was started; a full interaction and visual audit is outstanding. |
| Dependency history / license scan | **Not run** | Root audit only covers root production dependencies; backend audit was blocked. |

## 13. Missing features and incomplete implementations

Based on static source review, the following are absent or incomplete for a production-ready system:

- Consistent authentication/authorization and school-level ownership across every API.
- Student-safe exam serialization, immutable/authorized submissions, server-enforced timing, and published-result gates.
- Password reset/change persistence from the UI and removal of default/demo production credentials.
- Explicit live-vs-demo/offline state and error handling that cannot present fallback data as successful persistence.
- End-to-end AI output validation, explicit provider-failure handling, rate limiting, and documented privacy controls.
- A single authoritative DB/write strategy with detectable failure semantics.
- A valid backend lockfile and configured automated test/lint/integration suites.
- Clear current documentation, route ownership/retirement status, deployment start commands, and health checks that include database readiness.
- Runtime-verified accessibility, localization, responsiveness, and full page interaction coverage.

## 14. Prioritized fix plan

1. **Block release and contain credentials:** remove public account-seeding and CRUD routes; require JWT and role checks; remove demo identities/fallback JWT secret; rotate the Atlas credential if valid (SEC-001/005/007).
2. **Protect school and student data:** fix parent queries and `/my-children`; enforce school ownership on every API; restrict student/teacher records and relationships (SEC-004/009).
3. **Secure exam workflow end to end:** do not expose answer keys; authenticate/derive student identity; prevent duplicate attempts; enforce class, dates, status, deadlines, and publication gates; authorize results/export (SEC-002/003, BUG-004).
4. **Fix password and account creation:** wire UI to API, verify current password server-side, persist before reporting success, validate inputs, and never return credentials (SEC-006/008).
5. **Fix false-success/data integrity:** replace silent/sample fallbacks in authenticated paths; validate exams and CSV; handle DB/replica failures and remove implicit production seeding (BUG-001/003/006/009/010, SEC-011).
6. **Repair dependency/configuration baseline:** resolve `server/package-lock.json`, run clean install and audits, pin/fix React Router advisories, correct start scripts and current README (BUG-002/007).
7. **Add regression coverage:** unit tests for grading, CSV, validation, and services; API authorization/ownership tests using disposable DB fixtures; browser tests for role journeys and empty/error states.
8. **Verify deployment and user experience:** use a production-like deployment with test DB and mocked AI; run visual/mobile/accessibility/localization checks; document all env variables and health/readiness.

## 15. Final review-readiness checklist

- [ ] Public mutation/account routes disabled or protected by role and school ownership.
- [ ] JWT secret is mandatory, random, environment-only; demo accounts disabled in production; any exposed DB credential rotated.
- [ ] No API response returns plaintext passwords, hashes, answer keys, or unauthorized student records.
- [ ] Parent/student/teacher/principal records are constrained to authenticated relationships and school scope.
- [ ] Exam availability, identity, single-attempt policy, deadlines, grading totals, and result publication are enforced on the server.
- [ ] API failures are surfaced; demo data is explicitly labeled; no success-shaped local fallback for failed persistence.
- [ ] Database writes have one source of truth and failures are visible; production auto-seeding is disabled.
- [ ] Backend lockfile is valid; clean install, builds, security audits, and automated tests pass.
- [ ] Every intended page and interaction passes authenticated browser tests on desktop/mobile and both supported languages.
- [ ] Deployment variables, routes, health/readiness, and SPA refresh behavior are verified against the actual hosting environment.
- [ ] Data in `server/db_backup.json` and Git history has been reviewed for sensitive content/secrets.

**Baseline audit conclusion:** useful frontend structure and a passing production build were present, but the backend security posture and exam/data-isolation controls at that time were not safe for real student data. The current status and unresolved risks are recorded in section 16.

## 16. Remediation status

The following changes have been made in the current working tree after the baseline audit. They have not been committed.

### Implemented

- Protected student, teacher, principal, exam, submission, and parent routes with authentication and role checks; restricted seed/sample-account endpoints to development.
- Required a configured strong JWT secret at backend startup and removed production demo-login/token fallbacks.
- Removed plaintext passwords from account-creation responses and wired password changes through the authenticated backend API.
- Scoped student exam access and removed answer keys from student-facing exam responses. Submission identity is now derived from the authenticated student; class, publication, schedule, and duplicate-attempt checks were added.
- Restricted parent attendance/marks and child lookups to linked students; removed the arbitrary-child fallback and fail-open relationship behavior.
- Removed the dual-database writer, stopped automatic database seeding, and made production MongoDB configuration explicit.
- Hardened query filtering/pagination, AI endpoint access/input handling, and CSV formula escaping; API failures no longer return generated-question or analysis success-shaped fallbacks.
- Updated compatible frontend dependencies in the lockfile. The React Router 6.x version is now 6.30.6; no breaking major upgrade was applied.

### Validation performed after remediation

- `npm run build` — passed; Vite still reports the existing large JavaScript chunk warning (about 674 kB).
- `node --check` — passed for 64 changed, existing backend JavaScript files.
- Backend production dependency audit from `server/` — passed with 0 vulnerabilities.
- Frontend production dependency audit — still reports 2 moderate React Router advisories. `npm audit fix` applied compatible updates, but the remaining fix requires a breaking React Router 7 upgrade; this has not been applied.
- Focused in-memory assertions passed for query-helper base-filter preservation and CSV formula escaping.
- `git diff --check` passed, and no hard-coded demo passwords were found in the frontend source/build.

### Remaining risks and unverified behavior

- No database/API integration tests, browser tests, or end-to-end role workflows have been run. The absence of these tests means the authorization and data-isolation changes have not been verified against live request flows.
- School/tenant ownership is not proven complete across every controller; schema fields and identifiers remain inconsistent in parts of the application.
- Per-attempt exam duration enforcement is not implemented. Existing databases may contain duplicate submissions that prevent creation of the new unique index and may need a reviewed migration before deployment.
- Multi-document account creation remains non-transactional, so a later write failure can leave partial records.
- The root React Router advisories remain unresolved; upgrading to v7 requires a compatibility review and focused route/navigation tests.
- Credential/history scanning and any required rotation of the formerly embedded database credential have not been completed. Removing the dual-writer file does not remove secrets from Git history.
- Deployment configuration, actual production startup, accessibility, localization, responsive behavior, and school workflows remain unverified. Do not treat this static/local validation as production-readiness approval.

**Current conclusion:** remediation materially improves the audited surfaces, but the project is not yet verified safe for real student data. Resolve the remaining dependency and tenant-scope risks and run isolated integration/browser tests before deployment.

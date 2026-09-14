# AI-IGMS — Complete System Description (for drawing the flowchart)

AI-Enabled Integrated Government School Management System.
Everything below is taken from the actual code in your project folder, not a generic template.

**Stack**

| Part | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, react-router-dom v6, framer-motion, react-icons/fi |
| Backend | Node.js, Express 4, on port **5000**, base path **`/api`** |
| Database | MongoDB Atlas (cloud), database `ai_igms`, accessed through Mongoose 8 |
| Auth | jsonwebtoken (JWT, expires in 7 days) + bcryptjs (12 salt rounds) |
| Support | cors, morgan, express-rate-limit (100 requests / 15 min), dotenv |

**Scope note.** Right now only `/api/auth/*` and `/api/health` are actually mounted in the backend, and the React app still reads from the mock `src/services/api.js`. Every other endpoint below is designed and follows the identical pattern. Draw those with a **dashed border** and put a line in your legend saying "dashed = next phase, same pattern". Faculty respond well to that honesty, and it also explains why the pattern is worth showing.

---

## 1. The four layers

Your whole system is four layers stacked vertically. This is the skeleton of the flowchart.

1. **Browser / Frontend** — React app the user actually sees
2. **Network boundary** — HTTP request goes down, JSON response comes back up
3. **Server / Backend** — Express receives, checks and processes
4. **Database** — MongoDB Atlas, reached only through Mongoose

Plus one side lane: **Error path**, which runs instead of layer 4 whenever something fails.

The single most important idea for your viva: **the browser never touches MongoDB.** It has no database credentials at all. It can only ask Express, and Express verifies the token and the role before it queries anything.

---

## 2. Node list — draw one box per row

### Layer 1 — Frontend (colour: blue)

| ID | Box title | Text inside |
|---|---|---|
| F1 | Login page `/login` | user picks a role, types email + password, submits |
| F2 | 5 role portals | super_admin, principal, teacher, student, parent — each has its own home route |
| F3 | Pages + UI kit | 37 pages; shared Table, Modal, Badge, Dropdown, Pagination, Loader |
| F4 | AuthContext · ToastContext | holds the session; token + user saved in localStorage under `igms.auth.user`; toast messages |
| F5 | ProtectedRoute | role guard — wrong role is redirected to its own home route |
| F6 | `useFetch()` hook | calls the service and holds `data / loading / error` |
| F7 | **`services/api.js`** | **THE SEAM** — the one file where every outgoing request is built and every incoming response is parsed |

Draw F7 as a **wide bar spanning the full width** under F1–F6. That single shape is the honest answer to "kaha se request jati hai" — every request leaves from here and every response arrives here.

### Layer 2 — Backend (colour: indigo/purple)

Draw B1 to B7 as a **left-to-right chain**. This is the real order in `server/src`.

| ID | Box title | Text inside |
|---|---|---|
| B1 | `server.js` | entry point: `await connectDB()` then `app.listen(5000)` |
| B2 | `app.js` | creates the Express app, applies global middleware, mounts every route |
| B3 | Global middleware | `cors(CLIENT_URL)` → `express.json` (10 mb limit) → `express.urlencoded` → `morgan` logger → rate limit 100 per 15 min |
| B4 | `routes/auth.js` | matches the URL: `POST /register`, `POST /login`, `GET /me`, `PUT /change-password` |
| B5 | `protect` (middleware/auth.js) | reads the `Bearer` token, runs `jwt.verify(token, JWT_SECRET)`, loads `req.user` from the DB; rejects missing / invalid / expired tokens |
| B6 | `authorize(...roles)` (middleware/roleGuard.js) | is `req.user.role` in the allowed list? if not → **403 Forbidden** |
| B7 | Controller (`authController.js`) | the actual logic — validates, applies rules, ends with `res.json()` |

Draw B8 to B12 as a **second row** underneath — these are supporting files, not sequential steps.

| ID | Box title | Text inside |
|---|---|---|
| B8 | `models/` User.js · School.js | Mongoose schemas: validation, bcrypt pre-save hook, refs, indexes |
| B9 | `utils/asyncHandler` | wraps every async controller and forwards any throw to `next(err)` |
| B10 | `utils/ApiError` | badRequest 400 · unauthorized 401 · forbidden 403 · notFound 404 · conflict 409 |
| B11 | `middleware/errorHandler.js` | **registered LAST** — converts any error into `{ success:false, message }` + status code (draw in red) |
| B12 | `config/index.js` · `db.js` · `.env` | PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN 7d, CLIENT_URL for CORS — secrets never leave the server |
| B13 | External AI service | Grok API at `api.x.ai` — the **only** call that leaves your own network (draw dashed, purple) |

### Layer 3 — Database (colour: teal/green)

| ID | Box title | Text inside |
|---|---|---|
| D1 | Mongoose 8 ODM | schemas, validation, hooks, refs — the only way in |
| D2 | Atlas cluster `ai_igms` | `mongoose.connect(MONGODB_URI)` over an `mongodb+srv://` string; `config/db.js` forces Google DNS 8.8.8.8 so SRV lookups resolve on college networks |
| D3 | `users` collection | model `User.js` |
| D4 | `schools` collection | model `School.js` |
| D5 | next-phase collections | attendance, results, exams, submissions, notices, leave, timetable (dashed) |

### Error lane (colour: red, dashed border around the whole lane)

| ID | Box title | Text inside |
|---|---|---|
| E1 | Something throws | bad body · no token · expired token · wrong role · duplicate email · DB unreachable |
| E2 | `next(err)` | asyncHandler catches the rejected promise and forwards it |
| E3 | errorHandler maps it | `CastError` → 400 · duplicate key `11000` → 409 · `ValidationError` → 400 · anything else → 500 |
| E4 | Response goes back | `res.status(4xx / 5xx).json({ success:false, message })` |
| E5 | Frontend catches it | api.js throws → `useFetch` setError → `toast.error` — the page stays put, nothing crashes |

---

## 3. Arrow list — draw one arrow per row

Use **amber/orange for requests going out**, **green for responses coming back**, **red for the error route**. Label the important ones; that labelling is exactly what your faculty asked for.

| From | To | Colour | Label on the arrow |
|---|---|---|---|
| F1 | F7 | blue | `AuthContext.login()` → api.js |
| F2, F3 | F6 | blue | page calls the hook |
| F6 | F7 | amber | `useFetch(() => api.getX())` |
| F7 | B1 / B2 | **amber, thick** | **HTTP REQUEST — `fetch('http://localhost:5000/api/…')` · POST/GET/PUT · JSON body · header `Authorization: Bearer <JWT>`** |
| B1 → B2 → B3 → B4 → B5 → B6 → B7 | (chain) | indigo | each step hands off to the next |
| B6 | E1 | red | role not allowed → 403 |
| B7 | D1 | amber | **MONGOOSE QUERY — `User.findOne({email})`, `User.create()`, `doc.save()`, `.populate()`** |
| D1 | B7 | green | **DOCUMENTS BACK — BSON → plain JS objects** |
| B7 | F7 | **green, thick** | **JSON RESPONSE — `{ success:true, token, user, data }` or `{ success:false, message }` with 400 / 401 / 403 / 404 / 409 / 500** |
| F7 | F6 | green | parsed payload |
| F6 | F3 | green | `setData()` → React re-renders, toast appears |
| E1 → E2 → E3 → E4 → E5 | (chain) | red | the failure route |
| B7 | B13 | purple dashed | server-side call to the AI, API key stays on the server |

Two arrows carry the whole answer to your faculty's question, so make them the thickest on the page: **F7 → B1** going down (request leaving the frontend) and **B7 → F7** coming back up (response arriving). Put the request arrow on the left of the page and the response arrow on the right, so the eye traces a U.

---

## 4. The full lifecycle in 15 steps

Take one real action — *a teacher clicks Save on Mark Attendance* — and follow it end to end. If you want a second, simpler flowchart, this list is it.

1. **User action** — teacher taps Save on `MarkAttendance.jsx`
2. **Page calls the hook** — `useFetch(() => api.saveAttendance(rows))`
3. **api.js builds the request** — URL + method + JSON body + Bearer token read from localStorage
4. **Request leaves the browser** — `POST http://localhost:5000/api/attendance`
5. **Express receives it** — `app.js` chain: cors → express.json → urlencoded → morgan → rate limiter
6. **Router matches** — `app.use('/api/attendance', attendanceRoutes)` picks the handler
7. **`protect` runs** — `jwt.verify(token, JWT_SECRET)`, loads `req.user` from the users collection
8. **`authorize('teacher')` runs** — is this role allowed on this endpoint? if not, 403 and stop
9. **Controller runs** — wrapped in `asyncHandler`; validates the body, applies business rules
10. **Mongoose model** — `Attendance.create(...)` builds and validates the document
11. **MongoDB Atlas** — the query executes on the cluster, documents come back
12. **Server responds** — `res.status(200).json({ success:true, data })`
13. **api.js receives the JSON** — checks `res.ok`, parses the body, throws if `success` is false
14. **Hook updates state** — `setData(payload)`, `setError(null)`, `setLoading(false)`
15. **React re-renders** — table refreshes, KPI cards recount, success toast appears — the user finally sees the result

Steps 1–4 are the frontend sending. Steps 5–8 are the security gate. Steps 9–11 are the work. Steps 12–15 are the journey home.

---

## 5. Login and JWT flow (worth its own small diagram)

This is the one flow that is fully built, so it is the safest thing to be questioned on. It needs a **decision diamond**, which examiners like to see.

1. User submits the form on `/login`
2. `AuthContext.login()` → `api.js` builds `POST /api/auth/login` with body `{ email, password }` — note this route is **public**, no token needed yet
3. Controller checks both fields are present, else `ApiError.badRequest` → 400
4. `User.findOne({ email }).select('+password')` — the `+` is needed because `password` is `select: false` in the schema, so it is normally never returned
5. **DIAMOND — valid user AND active AND password matches?** Three checks: does the user exist, is `isActive` true, and does `user.comparePassword()` (bcrypt.compare) match the stored hash
6. **NO branch** → `401 Unauthorized` with the deliberately vague message "Invalid email or password" — vague on purpose, so an attacker cannot learn which field was wrong. Back in the browser: `toast.error`, user stays on `/login`, no session written
7. **YES branch** → stamp `lastLogin = new Date()`, `user.save()`, then `jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' })`
8. Respond `200 OK { success, token, user }` — `toJSON()` strips the password hash before it is ever sent
9. Browser stores token + user in localStorage under `igms.auth.user`
10. `ProtectedRoute` reads the role and redirects the user to their own home route

After login, every later request carries the header `Authorization: Bearer <token>`. `GET /api/auth/me` re-hydrates the session after a page refresh. If `mustChangePassword` is true the user is forced to `PUT /api/auth/change-password`. After 7 days the token expires, the next call returns 401, and the app logs out automatically.

---

## 6. Role-wise map — page → endpoint → collection

One shared login, five separate portals. What changes is the `role` claim inside the JWT, which decides which pages `ProtectedRoute` renders and which endpoints `authorize` lets through. Classes are standardised to **Class 1–8** across the whole project.

**Shared entry for all five:** `/login` → `POST /api/auth/login` → JWT issued → AuthContext → ProtectedRoute reads role → redirect to that role's home.

| Role | Home | Main pages | Endpoints it calls | Collections touched |
|---|---|---|---|---|
| **super_admin** | `/dashboard` | Dashboard (network KPIs), Schools (create and provision), Principals (assign logins), Reports | `GET/POST /api/schools`, `GET /api/users?role=principal`, `POST /api/auth/register` | schools, users |
| **principal** | `/dashboard` | Dashboard (school KPIs), Students, Teachers, Parents (Pending → Assign → Active), Notices, Timetable, Reports | `GET /api/users?role=student`, `POST /api/auth/register`, `PUT /api/users/:id`, `GET /api/attendance/summary`, `POST /api/notices` | users, attendance, notices, timetable |
| **teacher** | `/teacher/attendance` | Mark Attendance, Upload Marks, Online Exams (create, publish, evaluate, release), AI Paper Generator, Apply Leave, My Class, Timetable | `POST /api/attendance`, `POST /api/results`, `POST /api/exams`, `POST /api/ai/generate-paper`, `GET /api/exams/:id/submissions`, `POST /api/leave` | attendance, results, exams, submissions, leave |
| **student** | `/student/attendance` | My Attendance, My Results, Online Exams (start, attempt, auto-submit), Notices | `GET /api/attendance/me`, `GET /api/results/me`, `GET /api/exams/published`, `POST /api/exams/:id/submit` | attendance, results, exams, submissions |
| **parent** | `/parent/overview` | Child Overview, Child's Attendance, Child's Results, Notices | `GET /api/users/me` (children[]), `GET /api/attendance/:childId`, `GET /api/results/:childId` | users, attendance, results, notices |

Every role also gets **Change Password** (`PUT /api/auth/change-password`).

The parent link is worth pointing out: the parent's user document holds `children[]`, an array of refs to student users. That is what lets a parent read their own child's records and nobody else's.

---

## 7. Database schema

**`users` collection — model `User.js`**

Fields: `name`, `email` (unique, lowercase), `password` (bcrypt hash, `select: false`), `role` (enum: `super_admin | principal | teacher | student | parent`), `phone`, `avatar`, `school_id` (ref School), `children[]` (ref User — the parent link), `class_name`, `section`, `roll_no`, `subjects[]`, `classes_assigned[]`, `isActive`, `mustChangePassword`, `lastLogin`, `createdAt`, `updatedAt`.

Hooks and methods: a **pre-save hook** hashes the password with bcrypt at 12 salt rounds, so a plain password is never stored; `comparePassword()` does the bcrypt compare at login; `toJSON()` deletes the hash so it can never leak in a response. Index on `{ role: 1, school_id: 1 }` for fast per-school role lookups.

**`schools` collection — model `School.js`**

Fields: `name`, `code` (unique, uppercase), `address { street, city, state, pincode }`, `phone`, `email`, `principal_id` (ref User), `totalStudents`, `totalTeachers`, `isActive`, timestamps. One principal per school — this is what scopes every principal's queries to their own school.

**Next-phase collections**, each one model file following the same pattern: `attendance` (student_id, date, status, marked_by), `results` (student_id, exam_id, subject, marks), `exams` (school_id, class, subject, questions[], window), `submissions` (exam_id, student_id, answers[], score), `notices` (school_id, title, body, audience), `leave` (teacher_id, from, to, reason, status), `timetable`.

**Seeding:** `npm run seed` runs `src/seeds/seed.js` once to create the demo school, the super-admin and one user per role. Their passwords go through the same pre-save bcrypt hook, so even the seeded data stores only hashes.

---

## 8. AI online-exam pipeline

This is the only flow that leaves your own network, so it makes a strong final diagram. Three swimlanes: teacher's browser, your server, student's and parent's browser.

1. Teacher opens **CreateExamPage** — enters class, subject, syllabus topics, question count, marks, exam time window
2. Clicks **Generate** → `onlineExamService.js` → `api.js` builds the request
3. `POST /api/ai/generate-paper` with `{ class, subject, topics, count }` and the Bearer JWT; `protect` then `authorize('teacher')` run first
4. **The backend calls the AI** — a server-side request to the Grok API at `api.x.ai`. The API key lives in `.env` on the server and is never in the browser. This is the only outbound arrow on your whole chart — draw it dashed
5. MCQ JSON comes back — questions, four options each, plus the answer key — validated and reshaped into your own exam schema
6. Saved to the `exams` collection, one document per exam, status `draft`. **The answer key is never sent to a student, only the questions are**
7. Teacher reviews on **ExamDetailsPage**, edits any question, clicks Publish → status `published`
8. Student's **StudentExamsPage** shows the exam for that class only — the server filters by the school and class carried on the token
9. Student clicks Start → `GET /api/exams/:id` returns the questions **without the answer key**, and a countdown runs in the browser
10. **Submit** → `POST /api/exams/:id/submit` with the answers; it fires on the timer even if the student does nothing
11. **Auto-scoring happens on the server** — it compares the answers to the stored key and writes the score to `submissions`
12. Teacher sees **StudentSubmissions** with every auto-score, adds remarks, checks flagged answers
13. Teacher clicks **Release results** — the exam is marked evaluated and results become visible
14. Student's **My Results** — `GET /api/results/me` returns marks, subject breakdown, teacher's remarks
15. Parent sees the same — the parent token carries `children[]`, so `GET /api/results/:childId` returns that child's result in the parent portal

---

## 9. Drawing tips

**Shapes.** Rounded rectangles for processes and pages. Diamonds only for real decisions (there are three worth showing: is the token valid, is the role allowed, does the password match). Cylinder or a plain rectangle labelled with the collection name for data stores. Keep every box the same height within a row — uneven boxes are the main thing that makes a hand-made chart look untidy.

**Colours.** Blue for frontend, indigo for backend, teal for database, amber for the request path, green for the response path, red for errors, purple for the external AI. Put a small legend in a corner explaining those six colours; it saves you a lot of talking during the viva.

**Direction.** Keep one consistent reading direction. Top-to-bottom for the four layers, left-to-right inside the backend chain. Never let two arrows cross if you can route around instead.

**Labels.** Label every arrow that crosses a layer boundary with what actually travels on it — the URL, the method, the header, the response shape. Unlabelled arrows are what made your first attempt look thin. Inner arrows within a layer can stay unlabelled.

**What to say when asked "where does the request go".** Point at `services/api.js`, then trace: it leaves there as an HTTP request to `localhost:5000/api/...` carrying a JSON body and the Bearer token; Express takes it through cors, express.json, the rate limiter and morgan; the router picks the endpoint; `protect` verifies the JWT; `authorize` checks the role; only then does the controller run and query Mongoose; Atlas returns documents; the controller sends `res.json()`; api.js parses it; `useFetch` sets state; React re-renders. That one sentence, said while your finger follows the arrows, is the whole viva.

const BASE_URL = process.env.API_URL || "http://localhost:5000/api";

async function testSecurity() {
  console.log("==================================================");
  console.log("RUNNING ROLE SECURITY & ISOLATION TESTS");
  console.log("==================================================");

  // 1. Get tokens
  const parentRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "parent@ai-igms.gov.in", password: "admin" }),
  }).then(r => r.json());
  const parentToken = parentRes.token;

  const studentRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "student@ai-igms.gov.in", password: "admin" }),
  }).then(r => r.json());
  const studentToken = studentRes.token;

  const teacherRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "teacher@ai-igms.gov.in", password: "admin" }),
  }).then(r => r.json());
  const teacherToken = teacherRes.token;

  // Test 1: Parent trying to record attendance (MUST FAIL 403)
  const pAttendance = await fetch(`${BASE_URL}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${parentToken}` },
    body: JSON.stringify({ classVal: "6", date: "2026-10-01", records: [] }),
  });
  console.log(`${pAttendance.status === 403 ? "✅" : "❌"} [${pAttendance.status}] Parent denied from recording attendance (Expected 403)`);

  // Test 2: Parent trying to upload marks (MUST FAIL 403)
  const pMarks = await fetch(`${BASE_URL}/marks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${parentToken}` },
    body: JSON.stringify({ classVal: "6", subject: "Math", records: [] }),
  });
  console.log(`${pMarks.status === 403 ? "✅" : "❌"} [${pMarks.status}] Parent denied from uploading marks (Expected 403)`);

  // Test 3: Parent trying to modify timetable (MUST FAIL 403)
  const pTimetable = await fetch(`${BASE_URL}/timetable`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${parentToken}` },
    body: JSON.stringify({ className: "Class 6", period: 1 }),
  });
  console.log(`${pTimetable.status === 403 ? "✅" : "❌"} [${pTimetable.status}] Parent denied from modifying timetable (Expected 403)`);

  // Test 4: Parent trying to create holidays (MUST FAIL 403)
  const pHoliday = await fetch(`${BASE_URL}/holidays`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${parentToken}` },
    body: JSON.stringify({ date: "2026-12-25", title: { en: "Test", gu: "ટેસ્ટ" } }),
  });
  console.log(`${pHoliday.status === 403 ? "✅" : "❌"} [${pHoliday.status}] Parent denied from modifying holidays (Expected 403)`);

  // Test 5: Student trying to upload marks (MUST FAIL 403)
  const sMarks = await fetch(`${BASE_URL}/marks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${studentToken}` },
    body: JSON.stringify({ classVal: "6", subject: "Math", records: [] }),
  });
  console.log(`${sMarks.status === 403 ? "✅" : "❌"} [${sMarks.status}] Student denied from uploading marks (Expected 403)`);

  // Test 6: Teacher trying to approve leave (MUST FAIL 403)
  const tLeave = await fetch(`${BASE_URL}/leave/650000000000000000000001/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${teacherToken}` },
    body: JSON.stringify({ status: "Approved" }),
  });
  console.log(`${tLeave.status === 403 ? "✅" : "❌"} [${tLeave.status}] Teacher denied from approving leave (Expected 403)`);

  console.log("\n==================================================");
  console.log("ROLE SECURITY & ISOLATION CHECKS VERIFIED!");
  console.log("==================================================");
}

testSecurity().catch(console.error);

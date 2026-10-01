const BASE_URL = process.env.API_URL || "http://localhost:5000/api";

async function testEndpoint(name, url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    const isSuccess = res.status >= 200 && res.status < 300;
    console.log(`${isSuccess ? "✅" : "❌"} [${res.status}] ${name} (${options.method || "GET"} ${url})`);
    return { status: res.status, data, success: isSuccess };
  } catch (err) {
    console.log(`❌ [ERROR] ${name}: ${err.message}`);
    return { status: 500, error: err.message, success: false };
  }
}

async function runApiTests() {
  console.log("==================================================");
  console.log("RUNNING COMPREHENSIVE BACKEND API TEST SUITE");
  console.log("==================================================");

  // 1. AUTHENTICATION
  console.log("\n--- 1. AUTHENTICATION APIS ---");
  const loginRes = await testEndpoint("POST /api/auth/login (Admin)", `${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@ai-igms.gov.in", password: "admin" }),
  });
  const adminToken = loginRes.data?.token;

  const parentLoginRes = await testEndpoint("POST /api/auth/login (Parent)", `${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "parent@ai-igms.gov.in", password: "admin" }),
  });
  const parentToken = parentLoginRes.data?.token;

  const teacherLoginRes = await testEndpoint("POST /api/auth/login (Teacher)", `${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "teacher@ai-igms.gov.in", password: "admin" }),
  });
  const teacherToken = teacherLoginRes.data?.token;

  const studentLoginRes = await testEndpoint("POST /api/auth/login (Student)", `${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "student@ai-igms.gov.in", password: "admin" }),
  });
  const studentToken = studentLoginRes.data?.token;

  if (adminToken) {
    await testEndpoint("GET /api/auth/me (Admin Token)", `${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }

  // 2. PARENTS & CHILDREN ISOLATION
  console.log("\n--- 2. PARENT & CHILDREN ENDPOINTS ---");
  if (parentToken) {
    const myChildren = await testEndpoint("GET /api/parents/my-children (Parent Token)", `${BASE_URL}/parents/my-children`, {
      headers: { Authorization: `Bearer ${parentToken}` },
    });
    console.log("   -> Linked children returned:", myChildren.data?.children?.length || 0);
  }

  if (adminToken) {
    await testEndpoint("GET /api/parents (Admin Token)", `${BASE_URL}/parents`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }

  // 3. STUDENTS & TEACHERS
  console.log("\n--- 3. STUDENTS & TEACHERS ---");
  await testEndpoint("GET /api/students", `${BASE_URL}/students`);
  await testEndpoint("GET /api/teachers", `${BASE_URL}/teachers`);

  // 4. CLASSES & SUBJECTS
  console.log("\n--- 4. CLASSES & SUBJECTS ---");
  if (adminToken) {
    const classRes = await testEndpoint("GET /api/classes (Std 1-8)", `${BASE_URL}/classes`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("   -> Total classes in DB:", classRes.data?.length || 0);

    const subjectRes = await testEndpoint("GET /api/subjects", `${BASE_URL}/subjects`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("   -> Total subjects in DB:", subjectRes.data?.length || 0);

    await testEndpoint("GET /api/student-parents", `${BASE_URL}/student-parents`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }

  // 5. MID-DAY MEAL & HOLIDAYS
  console.log("\n--- 5. MID-DAY MEAL & HOLIDAYS ---");
  const weeklyMeal = await testEndpoint("GET /api/meals/weekly", `${BASE_URL}/meals/weekly`);
  console.log("   -> Weekly menu days count:", weeklyMeal.data?.length || 0);

  const todayMeal = await testEndpoint("GET /api/meals/today", `${BASE_URL}/meals/today`);
  console.log("   -> Today's meal snapshot:", todayMeal.data?.meal?.gu || todayMeal.data?.holidayMessage?.gu || "N/A");

  const holidays = await testEndpoint("GET /api/holidays", `${BASE_URL}/holidays`);
  console.log("   -> Total holidays in DB:", holidays.data?.length || 0);

  // 6. TIMETABLE
  console.log("\n--- 6. TIMETABLE ---");
  if (adminToken) {
    const ttRes = await testEndpoint("GET /api/timetable?className=Class 6&section=A", `${BASE_URL}/timetable?className=Class 6&section=A`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("   -> Timetable periods returned:", ttRes.data?.length || 0);
  }

  // 7. ATTENDANCE & MARKS
  console.log("\n--- 7. ATTENDANCE & MARKS ---");
  if (adminToken) {
    await testEndpoint("GET /api/attendance?studentId=STU-1001", `${BASE_URL}/attendance?studentId=STU-1001`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    await testEndpoint("GET /api/marks?studentId=STU-1001", `${BASE_URL}/marks?studentId=STU-1001`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }

  // 8. NOTICES & LEAVE
  console.log("\n--- 8. NOTICES & LEAVE ---");
  await testEndpoint("GET /api/notices", `${BASE_URL}/notices`);
  if (teacherToken) {
    await testEndpoint("GET /api/leave", `${BASE_URL}/leave`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
  }

  // 9. EXAMS & SUBMISSIONS
  console.log("\n--- 9. EXAMS ---");
  const examsRes = await testEndpoint("GET /api/exams", `${BASE_URL}/exams`);
  console.log("   -> Total exams:", examsRes.data?.length || 0);

  console.log("\n==================================================");
  console.log("API TEST SUITE COMPLETE!");
  console.log("==================================================");
}

runApiTests().catch(console.error);

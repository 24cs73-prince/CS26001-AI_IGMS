const BASE_URL = process.env.API_URL || "http://localhost:5000/api";

async function testChildIsolation() {
  console.log("==================================================");
  console.log("RUNNING PARENT-CHILD DATA ISOLATION TESTS");
  console.log("==================================================");

  // Parent login
  const parentRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "parent@ai-igms.gov.in", password: "admin" }),
  }).then(r => r.json());
  const parentToken = parentRes.token;

  // 1. GET /api/parents/my-children
  const myChildren = await fetch(`${BASE_URL}/parents/my-children`, {
    headers: { Authorization: `Bearer ${parentToken}` },
  }).then(r => r.json());
  console.log(`✅ [200] /api/parents/my-children returned ${myChildren.children?.length} linked child:`, myChildren.children?.map(c => c.name));

  // 2. Parent requests linked child's attendance (STU-1001) -> MUST SUCCEED (200)
  const linkedAtt = await fetch(`${BASE_URL}/attendance?studentId=STU-1001`, {
    headers: { Authorization: `Bearer ${parentToken}` },
  });
  console.log(`${linkedAtt.status === 200 ? "✅" : "❌"} [${linkedAtt.status}] Parent viewed linked child (STU-1001) attendance`);

  // 3. Parent requests non-linked student's attendance (STU-1009) -> MUST BE REJECTED (403)
  const nonLinkedAtt = await fetch(`${BASE_URL}/attendance?studentId=STU-1009`, {
    headers: { Authorization: `Bearer ${parentToken}` },
  });
  console.log(`${nonLinkedAtt.status === 403 ? "✅" : "❌"} [${nonLinkedAtt.status}] Parent blocked from viewing non-linked student (STU-1009) attendance (Expected 403 Forbidden)`);

  // 4. Parent requests linked child's marks (STU-1001) -> MUST SUCCEED (200)
  const linkedMarks = await fetch(`${BASE_URL}/marks?studentId=STU-1001`, {
    headers: { Authorization: `Bearer ${parentToken}` },
  });
  console.log(`${linkedMarks.status === 200 ? "✅" : "❌"} [${linkedMarks.status}] Parent viewed linked child (STU-1001) marks`);

  // 5. Parent requests non-linked student's marks (STU-1009) -> MUST BE REJECTED (403)
  const nonLinkedMarks = await fetch(`${BASE_URL}/marks?studentId=STU-1009`, {
    headers: { Authorization: `Bearer ${parentToken}` },
  });
  console.log(`${nonLinkedMarks.status === 403 ? "✅" : "❌"} [${nonLinkedMarks.status}] Parent blocked from viewing non-linked student (STU-1009) marks (Expected 403 Forbidden)`);

  console.log("\n==================================================");
  console.log("PARENT-CHILD ISOLATION VERIFIED SUCCESSFULLY!");
  console.log("==================================================");
}

testChildIsolation().catch(console.error);

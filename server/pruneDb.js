import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Student } from "./models/Student.js";
import { Teacher } from "./models/Teacher.js";
import { Parent } from "./models/Parent.js";
import { Principal } from "./models/Principal.js";
import { StudentParent } from "./models/StudentParent.js";
import { Exam } from "./models/Exam.js";
import { Submission } from "./models/Submission.js";
import { Mark } from "./models/Mark.js";
import { Notice } from "./models/Notice.js";
import { Leave } from "./models/Leave.js";
import { Attendance } from "./models/Attendance.js";

async function prune() {
  await connectDB();

  console.log("🧹 Starting DB pruning to single-entity state for clean website testing...");

  // 1. EXAMS & SUBMISSIONS & MARKS -> Delete ALL
  await Exam.deleteMany({});
  await Submission.deleteMany({});
  await Mark.deleteMany({});
  console.log("✅ Removed all Online Exams, Submissions, and Marks from DB.");

  // 2. STUDENTS -> Keep 1 (Aarav Sharma - STU-1001)
  const keptStudent = await Student.findOne({ studentId: "STU-1001" });
  if (keptStudent) {
    await Student.deleteMany({ _id: { $ne: keptStudent._id } });
  } else {
    // If STU-1001 not found, keep the first student
    const firstStu = await Student.findOne();
    if (firstStu) await Student.deleteMany({ _id: { $ne: firstStu._id } });
  }
  const remainingStudent = await Student.findOne();
  console.log("✅ Remaining Student:", remainingStudent ? `${remainingStudent.name} (${remainingStudent.studentId})` : "None");

  // 3. PARENTS & STUDENT-PARENT LINKS -> Keep 1 (Rajesh Sharma)
  const keptParent = await Parent.findOne({ $or: [{ parentId: "PAR-301" }, { firstName: "Rajesh" }] });
  if (keptParent) {
    await Parent.deleteMany({ _id: { $ne: keptParent._id } });
    if (remainingStudent) {
      await StudentParent.deleteMany({ parentId: { $ne: keptParent._id } });
    }
  } else {
    const firstPar = await Parent.findOne();
    if (firstPar) await Parent.deleteMany({ _id: { $ne: firstPar._id } });
  }
  const remainingParent = await Parent.findOne();
  console.log("✅ Remaining Parent:", remainingParent ? `${remainingParent.firstName} ${remainingParent.lastName}` : "None");

  // 4. TEACHERS -> Keep 1 (Dr. Meenakshi Iyer - TCH-201)
  const keptTeacher = await Teacher.findOne({ $or: [{ teacherId: "TCH-201" }, { name: /Meenakshi/i }] });
  if (keptTeacher) {
    await Teacher.deleteMany({ _id: { $ne: keptTeacher._id } });
  } else {
    const firstTch = await Teacher.findOne();
    if (firstTch) await Teacher.deleteMany({ _id: { $ne: firstTch._id } });
  }
  const remainingTeacher = await Teacher.findOne();
  console.log("✅ Remaining Teacher:", remainingTeacher ? `${remainingTeacher.name} (${remainingTeacher.teacherId})` : "None");

  // 5. PRINCIPALS -> Keep 1 (Rohan Administrator - PRN-101)
  const keptPrincipal = await Principal.findOne({ $or: [{ principalId: "PRN-101" }, { name: /Rohan/i }] });
  if (keptPrincipal) {
    await Principal.deleteMany({ _id: { $ne: keptPrincipal._id } });
  } else {
    const firstPrn = await Principal.findOne();
    if (firstPrn) await Principal.deleteMany({ _id: { $ne: firstPrn._id } });
  }
  const remainingPrincipal = await Principal.findOne();
  console.log("✅ Remaining Principal:", remainingPrincipal ? `${remainingPrincipal.name} (${remainingPrincipal.principalId})` : "None");

  // 6. USERS -> Keep exactly 1 per role (super_admin, principal, teacher, parent, student)
  const keptUsers = [];

  const superAdmin = await User.findOne({ roleKey: "super_admin" });
  if (superAdmin) keptUsers.push(superAdmin._id);

  const principalUser = await User.findOne({ roleKey: "principal" });
  if (principalUser) keptUsers.push(principalUser._id);

  const teacherUser = await User.findOne({ $or: [{ email: "meenakshi.i@igms.edu" }, { roleKey: "teacher" }] });
  if (teacherUser) keptUsers.push(teacherUser._id);

  const parentUser = await User.findOne({ $or: [{ email: "parent@school.gov.in" }, { roleKey: "parent" }] });
  if (parentUser) keptUsers.push(parentUser._id);

  const studentUser = await User.findOne({ $or: [{ email: "aarav.s@igms.edu" }, { roleKey: "student" }] });
  if (studentUser) keptUsers.push(studentUser._id);

  await User.deleteMany({ _id: { $nin: keptUsers } });
  const remainingUsers = await User.find();
  console.log("✅ Remaining Users count:", remainingUsers.length);
  remainingUsers.forEach((u) => console.log(`   - [${u.roleKey}] ${u.name} (${u.email})`));

  // 7. NOTICES & LEAVES & ATTENDANCE
  const noticeCount = await Notice.countDocuments();
  if (noticeCount > 1) {
    const firstNotice = await Notice.findOne();
    if (firstNotice) await Notice.deleteMany({ _id: { $ne: firstNotice._id } });
  }

  const leaveCount = await Leave.countDocuments();
  if (leaveCount > 1) {
    const firstLeave = await Leave.findOne();
    if (firstLeave) await Leave.deleteMany({ _id: { $ne: firstLeave._id } });
  }

  if (remainingStudent) {
    await Attendance.deleteMany({ studentId: { $ne: remainingStudent.studentId } });
  }

  console.log("✨ DB PRUNING COMPLETED! Database is in a pristine single-entity testing state.");
  process.exit(0);
}

prune();

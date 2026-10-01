import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_igms";

import { User } from "../models/User.js";
import { School } from "../models/School.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { Parent } from "../models/Parent.js";
import { Class } from "../models/Class.js";
import { Subject } from "../models/Subject.js";
import { StudentParent } from "../models/StudentParent.js";
import { Attendance } from "../models/Attendance.js";
import { Mark } from "../models/Mark.js";
import { Exam } from "../models/Exam.js";
import { Submission } from "../models/Submission.js";
import { Leave } from "../models/Leave.js";
import { Notice } from "../models/Notice.js";
import { Timetable } from "../models/Timetable.js";
import { MealMenu } from "../models/MealMenu.js";
import { Holiday } from "../models/Holiday.js";

async function validateAndFix() {
  console.log("Connecting to:", MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB:", mongoose.connection.name);

  // 1. ENSURE BASE SCHOOL
  let school = await School.findOne({ school_id: "SCH-001" });
  if (!school) {
    school = await School.create({
      school_id: "SCH-001",
      name: "PM Shri Government Higher Secondary School - Gandhinagar",
      udiseCode: "24070100101",
      category: "Higher Secondary",
      address: { district: "Gandhinagar", state: "Gujarat", pincode: "382010" },
      status: "Active",
    });
  }

  // 2. ENSURE USERS (Principal, Teachers, Students, Parents)
  const roleDisplayMap = {
    super_admin: "Super Admin",
    principal: "Principal",
    teacher: "Teacher",
    student: "Student",
    parent: "Parent",
  };

  const usersToEnsure = [
    { name: "Super Administrator", email: "admin@ai-igms.gov.in", password: "admin", roleKey: "super_admin" },
    { name: "Principal Dr. Rajesh Patel", email: "principal@ai-igms.gov.in", password: "admin", roleKey: "principal" },
    { name: "Dr. Meenakshi Iyer", email: "teacher@ai-igms.gov.in", password: "admin", roleKey: "teacher" },
    { name: "Rakesh Menon", email: "rakesh.m@igms.edu", password: "admin", roleKey: "teacher" },
    { name: "Sushmita Roy", email: "sushmita.r@igms.edu", password: "admin", roleKey: "teacher" },
    { name: "Aarav Sharma", email: "student@ai-igms.gov.in", password: "admin", roleKey: "student", studentId: "STU-1001", classVal: "6" },
    { name: "Diya Patel", email: "diya.p@igms.edu", password: "admin", roleKey: "student", studentId: "STU-1002", classVal: "6" },
    { name: "Rajesh K. Sharma", email: "parent@ai-igms.gov.in", password: "admin", roleKey: "parent", childStudentId: "STU-1001" },
    { name: "Rajesh K. Sharma", email: "parent@school.gov.in", password: "admin", roleKey: "parent", childStudentId: "STU-1001" },
  ];

  const userMap = {};
  for (const u of usersToEnsure) {
    let existingUser = await User.findOne({ email: u.email });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(u.password, salt);

    if (!existingUser) {
      existingUser = await User.create({
        name: u.name,
        email: u.email,
        passwordHash: hash,
        roleKey: u.roleKey,
        role: roleDisplayMap[u.roleKey],
        studentId: u.studentId || null,
        childStudentId: u.childStudentId || null,
        classVal: u.classVal || null,
        school_id: "SCH-001",
        schoolName: "PM Shri Government Higher Secondary School - Gandhinagar",
        status: "Active",
      });
    } else {
      existingUser.passwordHash = hash;
      existingUser.role = roleDisplayMap[u.roleKey];
      if (u.studentId) existingUser.studentId = u.studentId;
      if (u.childStudentId) existingUser.childStudentId = u.childStudentId;
      await existingUser.save();
    }
    userMap[u.email] = existingUser;
  }

  // 3. ENSURE CLASSES (Classes 1 to 8, Sections A & B)
  const classMap = {};
  for (let std = 1; std <= 8; std++) {
    for (const sec of ["A", "B"]) {
      let cls = await Class.findOne({ standard: std, section: sec });
      if (!cls) {
        cls = await Class.create({
          schoolId: "SCH-001",
          className: `Class ${std}`,
          standard: std,
          section: sec,
          academicYear: "2025-26",
          capacity: 40,
          totalStudents: 30,
          status: "Active",
        });
      }
      classMap[`${std}-${sec}`] = cls;
    }
  }

  // 4. ENSURE SUBJECTS (8 Standard Gujarat Curriculum Subjects)
  const subjectsData = [
    { name: "Gujarati", nameGu: "ગુજરાતી", code: "GUJ-101", applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8] },
    { name: "Mathematics", nameGu: "ગણિત", code: "MATH-101", applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8] },
    { name: "Science", nameGu: "વિજ્ઞાન", code: "SCI-101", applicableStandards: [3, 4, 5, 6, 7, 8] },
    { name: "English", nameGu: "અંગ્રેજી", code: "ENG-101", applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8] },
    { name: "Social Science", nameGu: "સામાજિક વિજ્ઞાન", code: "SS-101", applicableStandards: [5, 6, 7, 8] },
    { name: "Hindi", nameGu: "હિન્દી", code: "HIN-101", applicableStandards: [5, 6, 7, 8] },
    { name: "Computer Studies", nameGu: "કમ્પ્યુટર શિક્ષણ", code: "COMP-101", applicableStandards: [5, 6, 7, 8] },
    { name: "Physical Education", nameGu: "શારીરિક શિક્ષણ", code: "PE-101", applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8] },
  ];

  const subjectMap = {};
  for (const s of subjectsData) {
    let sub = await Subject.findOne({ code: s.code });
    if (!sub) {
      sub = await Subject.create({
        schoolId: "SCH-001",
        ...s,
      });
    }
    subjectMap[s.name] = sub;
  }

  // 5. ENSURE TEACHERS & LINK USERS
  const teacherEmailMap = {
    "Dr. Meenakshi Iyer": "teacher@ai-igms.gov.in",
    "Rakesh Menon": "rakesh.m@igms.edu",
    "Sushmita Roy": "sushmita.r@igms.edu",
  };

  const teachers = await Teacher.find();
  for (const t of teachers) {
    if (!t.userId && teacherEmailMap[t.name]) {
      const u = userMap[teacherEmailMap[t.name]];
      if (u) {
        t.userId = u._id;
        t.schoolId = "SCH-001";
        await t.save();
      }
    }
  }

  // 6. ENSURE STUDENTS & LINK CLASSES & USERS
  const students = await Student.find();
  for (const s of students) {
    // Determine class standard from className
    const stdMatch = s.className ? s.className.match(/\d+/) : null;
    const stdNum = stdMatch ? parseInt(stdMatch[0], 10) : 6;
    const sec = s.section || "A";
    const targetClass = classMap[`${stdNum}-${sec}`] || classMap["6-A"];

    if (targetClass) {
      s.classId = targetClass._id;
    }
    if (s.studentId === "STU-1001" && userMap["student@ai-igms.gov.in"]) {
      s.userId = userMap["student@ai-igms.gov.in"]._id;
    }
    if (s.studentId === "STU-1002" && userMap["diya.p@igms.edu"]) {
      s.userId = userMap["diya.p@igms.edu"]._id;
    }
    s.schoolId = "SCH-001";
    await s.save();
  }

  // 7. ENSURE PARENTS & LINK TO USERS & STUDENTPARENT
  const parentUsers = [userMap["parent@ai-igms.gov.in"], userMap["parent@school.gov.in"]].filter(Boolean);
  for (const pu of parentUsers) {
    let parentDoc = await Parent.findOne({ userId: pu._id });
    if (!parentDoc) {
      parentDoc = await Parent.create({
        userId: pu._id,
        parentId: `PAR-${pu._id.toString().slice(-4)}`,
        firstName: "Rajesh",
        middleName: "K",
        lastName: "Sharma",
        phone: "+91 98110 22331",
        email: pu.email,
        occupation: "Business Executive",
        status: "Active",
      });
    }

    // Ensure StudentParent links for STU-1001 (Aarav Sharma) & STU-1002 (Diya Patel)
    const primaryStudent = await Student.findOne({ studentId: "STU-1001" });
    if (primaryStudent) {
      await StudentParent.findOneAndUpdate(
        { studentId: "STU-1001", parentId: parentDoc._id },
        {
          studentId: "STU-1001",
          parentId: parentDoc._id,
          parentUserId: pu._id,
          relationship: "Father",
          isPrimary: true,
        },
        { upsert: true, new: true }
      );
    }
  }

  // 8. FIX ORPHANED SUBMISSIONS
  const allExams = await Exam.find();
  const validExamId = allExams.length > 0 ? allExams[0]._id : null;
  const submissions = await Submission.find();
  for (const sub of submissions) {
    if (sub.examId && !(await Exam.exists({ _id: sub.examId }))) {
      if (validExamId) {
        sub.examId = validExamId;
        await sub.save();
        console.log(`Linked orphaned submission ${sub._id} to valid Exam ${validExamId}`);
      } else {
        await Submission.deleteOne({ _id: sub._id });
        console.log(`Deleted orphaned submission ${sub._id}`);
      }
    }
  }

  // 9. ENSURE COMPLETE TIMETABLE FOR CLASS 6-A & OTHER CLASSES
  const teacher1 = await Teacher.findOne({ name: "Dr. Meenakshi Iyer" });
  const teacher2 = await Teacher.findOne({ name: "Sushmita Roy" });
  const teacher3 = await Teacher.findOne({ name: "Rakesh Menon" });

  const class6A = classMap["6-A"];
  if (class6A) {
    await Timetable.deleteMany({ className: "Class 6", section: "A" });
    const timetableEntries = [
      {
        schoolId: "SCH-001",
        classId: class6A._id,
        className: "Class 6",
        section: "A",
        dayOfWeek: 1,
        dayName: { en: "Monday", gu: "સોમવાર" },
        period: 1,
        subjectId: subjectMap["Mathematics"]?._id,
        subjectName: "Mathematics",
        teacherId: teacher1?.userId,
        teacherName: "Dr. Meenakshi Iyer",
        startTime: "08:00 AM",
        endTime: "08:45 AM",
        room: "Room 101",
      },
      {
        schoolId: "SCH-001",
        classId: class6A._id,
        className: "Class 6",
        section: "A",
        dayOfWeek: 1,
        dayName: { en: "Monday", gu: "સોમવાર" },
        period: 2,
        subjectId: subjectMap["Gujarati"]?._id,
        subjectName: "Gujarati",
        teacherId: teacher2?.userId,
        teacherName: "Sushmita Roy",
        startTime: "08:45 AM",
        endTime: "09:30 AM",
        room: "Room 101",
      },
      {
        schoolId: "SCH-001",
        classId: class6A._id,
        className: "Class 6",
        section: "A",
        dayOfWeek: 1,
        dayName: { en: "Monday", gu: "સોમવાર" },
        period: 3,
        subjectId: subjectMap["Science"]?._id,
        subjectName: "Science",
        teacherId: teacher3?.userId,
        teacherName: "Rakesh Menon",
        startTime: "09:45 AM",
        endTime: "10:30 AM",
        room: "Room 101",
      },
      {
        schoolId: "SCH-001",
        classId: class6A._id,
        className: "Class 6",
        section: "A",
        dayOfWeek: 1,
        dayName: { en: "Monday", gu: "સોમવાર" },
        period: 4,
        subjectId: subjectMap["English"]?._id,
        subjectName: "English",
        teacherId: teacher2?.userId,
        teacherName: "Sushmita Roy",
        startTime: "10:30 AM",
        endTime: "11:15 AM",
        room: "Room 101",
      },
      {
        schoolId: "SCH-001",
        classId: class6A._id,
        className: "Class 6",
        section: "A",
        dayOfWeek: 1,
        dayName: { en: "Monday", gu: "સોમવાર" },
        period: 5,
        subjectId: subjectMap["Social Science"]?._id,
        subjectName: "Social Science",
        teacherId: teacher1?.userId,
        teacherName: "Dr. Meenakshi Iyer",
        startTime: "11:45 AM",
        endTime: "12:30 PM",
        room: "Room 101",
      },
      {
        schoolId: "SCH-001",
        classId: class6A._id,
        className: "Class 6",
        section: "A",
        dayOfWeek: 1,
        dayName: { en: "Monday", gu: "સોમવાર" },
        period: 6,
        subjectId: subjectMap["Computer Studies"]?._id,
        subjectName: "Computer Studies",
        teacherId: teacher3?.userId,
        teacherName: "Rakesh Menon",
        startTime: "12:30 PM",
        endTime: "01:15 PM",
        room: "Computer Lab",
      },
    ];
    await Timetable.insertMany(timetableEntries);
    console.log("✅ Seeded validated Timetable records for Class 6-A");
  }

  // 10. ENSURE MID-DAY MEALS (Monday to Saturday with exact timings)
  await MealMenu.deleteMany({});
  const weeklyMeals = [
    {
      schoolId: "SCH-001",
      dayOfWeek: 1,
      dayName: { en: "Monday", gu: "સોમવાર" },
      snack: { en: "Sukhdi (Whole wheat & jaggery traditional sweet)", gu: "સુખડી" },
      meal: { en: "Vegetable Khichdi or Khari Bhat with Vegetables", gu: "વેજીટેબલ ખીચડી અથવા ખારી ભાત શાકભાજી સહિત" },
      time: { en: "1:30 PM - 2:00 PM", gu: "બપોરે ૧:૩૦ થી ૨:૦૦" },
      mealStartTime: "13:30",
      mealEndTime: "14:00",
      snackStartTime: "10:30",
      snackEndTime: "11:00",
      tag: { en: "Nutritious Diet", gu: "પૌષ્ટિક આહાર" },
    },
    {
      schoolId: "SCH-001",
      dayOfWeek: 2,
      dayName: { en: "Tuesday", gu: "મંગળવાર" },
      snack: { en: "Sprouted Pulses Chaat (Moong/Chickpeas)", gu: "કઠોળ ચાટ (કાળા મગ/લીલા મગ, ચણા કે ઉપલબ્ધ કઠોળ)" },
      meal: { en: "Fada Lapsi with Vegetable Curry or Muthia with Curry", gu: "ફાડા લાપસી અને શાક અથવા મુઠિયા અને શાક" },
      time: { en: "1:30 PM - 2:00 PM", gu: "બપોરે ૧:૩૦ થી ૨:૦૦" },
      mealStartTime: "13:30",
      mealEndTime: "14:00",
      snackStartTime: "10:30",
      snackEndTime: "11:00",
      tag: { en: "Balanced Diet", gu: "સંતુલિત આહાર" },
    },
    {
      schoolId: "SCH-001",
      dayOfWeek: 3,
      dayName: { en: "Wednesday", gu: "બુધવાર" },
      snack: { en: "Mixed Dal / Available Pulses / Usal", gu: "મીક્ષ દાળ/ ઉપલબ્ધ કઠોળ/ ઉસળ" },
      meal: { en: "Vegetable Pulao", gu: "વેજીટેબલ પુલાવ" },
      time: { en: "1:30 PM - 2:00 PM", gu: "બપોરે ૧:૩૦ થી ૨:૦૦" },
      mealStartTime: "13:30",
      mealEndTime: "14:00",
      snackStartTime: "10:30",
      snackEndTime: "11:00",
      tag: { en: "Protein Rich", gu: "પ્રોટીનયુક્ત આહાર" },
    },
    {
      schoolId: "SCH-001",
      dayOfWeek: 4,
      dayName: { en: "Thursday", gu: "ગુરુવાર" },
      snack: { en: "Sprouted Pulses Chaat (Moong/Chickpeas)", gu: "કઠોળ ચાટ (કાળા મગ/લીલા મગ, ચણા કે ઉપલબ્ધ કઠોળ)" },
      meal: { en: "Dal Dhokli", gu: "દાળ ઢોકળી" },
      time: { en: "1:30 PM - 2:00 PM", gu: "બપોરે ૧:૩૦ થી ૨:૦૦" },
      mealStartTime: "13:30",
      mealEndTime: "14:00",
      snackStartTime: "10:30",
      snackEndTime: "11:00",
      tag: { en: "Wholesome & Delicious", gu: "સ્વાદિષ્ટ અને પૌષ્ટિક" },
    },
    {
      schoolId: "SCH-001",
      dayOfWeek: 5,
      dayName: { en: "Friday", gu: "શુક્રવાર" },
      snack: { en: "Steamed Muthia", gu: "મુઠિયા" },
      meal: { en: "Dal Rice (Dal-Bhat)", gu: "દાળ ભાત" },
      time: { en: "1:30 PM - 2:00 PM", gu: "બપોરે ૧:૩૦ થી ૨:૦૦" },
      mealStartTime: "13:30",
      mealEndTime: "14:00",
      snackStartTime: "10:30",
      snackEndTime: "11:00",
      tag: { en: "Complete Nutrition", gu: "સંપૂર્ણ પૌષ્ટિક આહાર" },
    },
    {
      schoolId: "SCH-001",
      dayOfWeek: 6,
      dayName: { en: "Saturday", gu: "શનિવાર" },
      snack: { en: "Sprouted Pulses Chaat (Moong/Chickpeas)", gu: "કઠોળ ચાટ (કાળા મગ/લીલા મગ, ચણા કે ઉપલબ્ધ કઠોળ)" },
      meal: { en: "Vegetable Pulao", gu: "વેજીટેબલ પુલાવ" },
      time: { en: "12:00 PM - 12:30 PM", gu: "બપોરે ૧૨:૦૦ થી ૧૨:૩૦" },
      mealStartTime: "12:00",
      mealEndTime: "12:30",
      snackStartTime: "10:00",
      snackEndTime: "10:30",
      tag: { en: "Saturday Special Meal", gu: "શનિવારનું વિશેષ ભોજન" },
    },
  ];
  await MealMenu.insertMany(weeklyMeals);
  console.log("✅ Seeded Monday-Saturday Mid-Day Meal Menu with accurate timings");

  // 11. ENSURE HOLIDAYS
  await Holiday.deleteMany({});
  await Holiday.insertMany([
    {
      schoolId: "SCH-001",
      date: "2025-10-20",
      title: { en: "Diwali Vacation Start", gu: "દિવાળી વેકેશન પ્રારંભ" },
      description: "State government school festival vacation",
      holidayType: "Vacation",
    },
    {
      schoolId: "SCH-001",
      date: "2026-01-26",
      title: { en: "Republic Day", gu: "પ્રજાસત્તાક દિન" },
      description: "National Holiday & Flag Hoisting ceremony",
      holidayType: "Public Holiday",
    },
    {
      schoolId: "SCH-001",
      date: "2026-08-15",
      title: { en: "Independence Day", gu: "સ્વાતંત્ર્ય દિન" },
      description: "National Holiday",
      holidayType: "Public Holiday",
    },
    {
      schoolId: "SCH-001",
      date: "2026-10-02",
      title: { en: "Gandhi Jayanti", gu: "ગાંધી જયંતિ" },
      description: "Mahatma Gandhi Birthday National Holiday",
      holidayType: "Public Holiday",
    },
  ]);
  console.log("✅ Seeded Gujarat School Holidays");

  // 12. ENSURE MARKS FOR STUDENTS
  await Mark.deleteMany({});
  const sampleMarks = [
    {
      school_id: "SCH-001",
      classVal: "6",
      division: "A",
      subject: "Mathematics",
      examTerm: "Mid-Term 2026",
      maxMarks: 100,
      records: [
        { studentId: "STU-1001", studentName: "Aarav Sharma", marksObtained: 94, grade: "A+", remarks: "Excellent problem solving" },
        { studentId: "STU-1002", studentName: "Diya Patel", marksObtained: 91, grade: "A+", remarks: "Outstanding performance" },
        { studentId: "STU-1003", studentName: "Vivaan Gupta", marksObtained: 68, grade: "B", remarks: "Good, needs algebra practice" },
      ],
    },
    {
      school_id: "SCH-001",
      classVal: "6",
      division: "A",
      subject: "Science",
      examTerm: "Mid-Term 2026",
      maxMarks: 100,
      records: [
        { studentId: "STU-1001", studentName: "Aarav Sharma", marksObtained: 88, grade: "A", remarks: "Strong conceptual understanding" },
        { studentId: "STU-1002", studentName: "Diya Patel", marksObtained: 95, grade: "A+", remarks: "Top in practicals" },
      ],
    },
    {
      school_id: "SCH-001",
      classVal: "6",
      division: "A",
      subject: "Gujarati",
      examTerm: "Mid-Term 2026",
      maxMarks: 100,
      records: [
        { studentId: "STU-1001", studentName: "Aarav Sharma", marksObtained: 92, grade: "A+", remarks: "ઉત્તમ લેખન અને વાચન" },
        { studentId: "STU-1002", studentName: "Diya Patel", marksObtained: 89, grade: "A", remarks: "સરસ પ્રદર્શન" },
      ],
    },
    {
      school_id: "SCH-001",
      classVal: "6",
      division: "A",
      subject: "English",
      examTerm: "Mid-Term 2026",
      maxMarks: 100,
      records: [
        { studentId: "STU-1001", studentName: "Aarav Sharma", marksObtained: 85, grade: "A", remarks: "Good grammar and vocabulary" },
        { studentId: "STU-1002", studentName: "Diya Patel", marksObtained: 92, grade: "A+", remarks: "Excellent essay writing" },
      ],
    },
  ];
  await Mark.insertMany(sampleMarks);
  console.log("✅ Seeded Subject Marks for Class 6-A");

  // 13. ENSURE ATTENDANCE FOR STUDENTS
  await Attendance.deleteMany({});
  const dates = ["2026-09-22", "2026-09-23", "2026-09-24", "2026-09-25", "2026-09-26", "2026-09-28", "2026-09-29", "2026-09-30"];
  const attendanceDocs = dates.map((date) => ({
    school_id: "SCH-001",
    classVal: "6",
    division: "A",
    date,
    recordedBy: userMap["teacher@ai-igms.gov.in"]?._id,
    records: [
      { studentId: "STU-1001", studentName: "Aarav Sharma", status: "Present", remarks: "" },
      { studentId: "STU-1002", studentName: "Diya Patel", status: "Present", remarks: "" },
      { studentId: "STU-1003", studentName: "Vivaan Gupta", status: date === "2026-09-24" ? "Absent" : "Present", remarks: date === "2026-09-24" ? "Sick Leave" : "" },
    ],
  }));
  await Attendance.insertMany(attendanceDocs);
  console.log("✅ Seeded Attendance records for Class 6-A");

  // 14. ENSURE NOTICES WITH TARGET AUDIENCES
  await Notice.deleteMany({});
  await Notice.insertMany([
    {
      title: "Annual Science & Innovation Fair 2026",
      category: "Event",
      audience: "All",
      priority: "Important",
      content: "All students from Class 5 to 8 are invited to participate in the upcoming Science Fair on 15th October.",
      publishedBy: "Dr. Meenakshi Iyer",
    },
    {
      title: "Mid-Term Examination Schedule Released",
      category: "Examination",
      audience: "Students",
      priority: "Important",
      content: "The Mid-Term exam schedule for Class 1 to 8 is published. Please review your timetable.",
      publishedBy: "Principal Dr. Rajesh Patel",
    },
    {
      title: "Quarterly Parent-Teacher Meeting (PTM)",
      category: "Administrative",
      audience: "Parents",
      priority: "Important",
      content: "Dear Parents, the PTM is scheduled for this Saturday at 10:00 AM to discuss student progress.",
      publishedBy: "Principal Dr. Rajesh Patel",
    },
    {
      title: "Staff Academic Review Meeting",
      category: "Academic",
      audience: "Teachers",
      priority: "Normal",
      content: "All faculty members are requested to submit the syllabus completion report by Friday.",
      publishedBy: "Principal Dr. Rajesh Patel",
    },
  ]);
  console.log("✅ Seeded Targeted Notices");

  // 15. ENSURE LEAVES
  await Leave.deleteMany({});
  await Leave.insertMany([
    {
      teacherId: userMap["teacher@ai-igms.gov.in"]?._id,
      teacherName: "Dr. Meenakshi Iyer",
      leaveType: "Sick Leave",
      startDate: "2026-10-10",
      endDate: "2026-10-12",
      totalDays: 3,
      reason: "Medical checkup and recovery",
      status: "Approved",
      appliedAt: new Date("2026-10-01"),
    },
    {
      teacherId: userMap["rakesh.m@igms.edu"]?._id,
      teacherName: "Rakesh Menon",
      leaveType: "Casual Leave",
      startDate: "2026-10-18",
      endDate: "2026-10-19",
      totalDays: 2,
      reason: "Family function",
      status: "Pending",
      appliedAt: new Date("2026-10-01"),
    },
  ]);
  console.log("✅ Seeded Teacher Leave records");

  console.log("\n✨ DATABASE DATA & RELATIONSHIP REPAIR COMPLETE!");
  await mongoose.disconnect();
}

validateAndFix().catch(console.error);

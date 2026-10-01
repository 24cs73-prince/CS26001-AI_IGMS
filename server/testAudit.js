import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_igms';

async function getModel(modulePath) {
  const mod = await import(modulePath);
  return mod.default || Object.values(mod)[0];
}

async function runAudit() {
  console.log('Connecting to:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB:', mongoose.connection.name);

  const User = await getModel('./models/User.js');
  const School = await getModel('./models/School.js');
  const Student = await getModel('./models/Student.js');
  const Teacher = await getModel('./models/Teacher.js');
  const Parent = await getModel('./models/Parent.js');
  const ClassModel = await getModel('./models/Class.js');
  const Subject = await getModel('./models/Subject.js');
  const StudentParent = await getModel('./models/StudentParent.js');
  const Attendance = await getModel('./models/Attendance.js');
  const Mark = await getModel('./models/Mark.js');
  const Exam = await getModel('./models/Exam.js');
  const Submission = await getModel('./models/Submission.js');
  const Leave = await getModel('./models/Leave.js');
  const Notice = await getModel('./models/Notice.js');
  const Timetable = await getModel('./models/Timetable.js');
  const MealMenu = await getModel('./models/MealMenu.js');
  const Holiday = await getModel('./models/Holiday.js');

  const models = {
    users: User,
    schools: School,
    students: Student,
    teachers: Teacher,
    parents: Parent,
    classes: ClassModel,
    subjects: Subject,
    studentparents: StudentParent,
    attendances: Attendance,
    marks: Mark,
    exams: Exam,
    submissions: Submission,
    leaves: Leave,
    notices: Notice,
    timetables: Timetable,
    mealmenus: MealMenu,
    holidays: Holiday
  };

  const counts = {};
  for (const [name, model] of Object.entries(models)) {
    counts[name] = await model.countDocuments();
  }
  console.log('\n==================================================');
  console.log('1. DOCUMENT COUNTS OF ALL 17 COLLECTIONS');
  console.log('==================================================');
  for (const [name, count] of Object.entries(counts)) {
    console.log(`${name}: ${count}`);
  }

  // Check Orphaned References
  const orphans = [];

  // Student -> User, School, Class
  const students = await Student.find();
  for (const s of students) {
    if (s.userId && mongoose.Types.ObjectId.isValid(s.userId) && !(await User.exists({ _id: s.userId }))) orphans.push(`Student ${s._id} (${s.name}) -> User ${s.userId} NOT FOUND`);
    if (s.schoolId && mongoose.Types.ObjectId.isValid(s.schoolId) && !(await School.exists({ _id: s.schoolId }))) orphans.push(`Student ${s._id} (${s.name}) -> School ${s.schoolId} NOT FOUND`);
    if (s.classId && mongoose.Types.ObjectId.isValid(s.classId) && !(await ClassModel.exists({ _id: s.classId }))) orphans.push(`Student ${s._id} (${s.name}) -> Class ${s.classId} NOT FOUND`);
  }

  // Teacher -> User, School
  const teachers = await Teacher.find();
  for (const t of teachers) {
    if (t.userId && mongoose.Types.ObjectId.isValid(t.userId) && !(await User.exists({ _id: t.userId }))) orphans.push(`Teacher ${t._id} (${t.name}) -> User ${t.userId} NOT FOUND`);
    if (t.schoolId && mongoose.Types.ObjectId.isValid(t.schoolId) && !(await School.exists({ _id: t.schoolId }))) orphans.push(`Teacher ${t._id} (${t.name}) -> School ${t.schoolId} NOT FOUND`);
  }

  // Parent -> User, School
  const parents = await Parent.find();
  for (const p of parents) {
    if (p.userId && mongoose.Types.ObjectId.isValid(p.userId) && !(await User.exists({ _id: p.userId }))) orphans.push(`Parent ${p._id} (${p.name}) -> User ${p.userId} NOT FOUND`);
    if (p.schoolId && mongoose.Types.ObjectId.isValid(p.schoolId) && !(await School.exists({ _id: p.schoolId }))) orphans.push(`Parent ${p._id} (${p.name}) -> School ${p.schoolId} NOT FOUND`);
  }

  // StudentParent -> Student, Parent
  const studentParents = await StudentParent.find();
  for (const sp of studentParents) {
    if (sp.studentId && mongoose.Types.ObjectId.isValid(sp.studentId) && !(await Student.exists({ _id: sp.studentId }))) orphans.push(`StudentParent ${sp._id} -> Student ${sp.studentId} NOT FOUND`);
    if (sp.parentId && mongoose.Types.ObjectId.isValid(sp.parentId) && !(await Parent.exists({ _id: sp.parentId }))) orphans.push(`StudentParent ${sp._id} -> Parent ${sp.parentId} NOT FOUND`);
  }

  // Attendance -> recordedBy User
  const attendances = await Attendance.find();
  for (const a of attendances) {
    if (a.recordedBy && mongoose.Types.ObjectId.isValid(a.recordedBy) && !(await User.exists({ _id: a.recordedBy }))) orphans.push(`Attendance ${a._id} -> User ${a.recordedBy} NOT FOUND`);
  }

  // Mark -> Student, Subject, Class, Teacher
  const marks = await Mark.find();
  for (const m of marks) {
    if (m.studentId && mongoose.Types.ObjectId.isValid(m.studentId) && !(await Student.exists({ _id: m.studentId }))) orphans.push(`Mark ${m._id} -> Student ${m.studentId} NOT FOUND`);
    if (m.subjectId && mongoose.Types.ObjectId.isValid(m.subjectId) && !(await Subject.exists({ _id: m.subjectId }))) orphans.push(`Mark ${m._id} -> Subject ${m.subjectId} NOT FOUND`);
    if (m.classId && mongoose.Types.ObjectId.isValid(m.classId) && !(await ClassModel.exists({ _id: m.classId }))) orphans.push(`Mark ${m._id} -> Class ${m.classId} NOT FOUND`);
    if (m.teacherId && mongoose.Types.ObjectId.isValid(m.teacherId) && !(await Teacher.exists({ _id: m.teacherId }))) orphans.push(`Mark ${m._id} -> Teacher ${m.teacherId} NOT FOUND`);
  }

  // Exam -> Teacher/User
  const exams = await Exam.find();
  for (const e of exams) {
    if (e.teacherId && mongoose.Types.ObjectId.isValid(e.teacherId) && !(await User.exists({ _id: e.teacherId }))) orphans.push(`Exam ${e._id} -> User/Teacher ${e.teacherId} NOT FOUND`);
  }

  // Submission -> Exam, Student
  const submissions = await Submission.find();
  for (const sub of submissions) {
    if (sub.examId && mongoose.Types.ObjectId.isValid(sub.examId) && !(await Exam.exists({ _id: sub.examId }))) orphans.push(`Submission ${sub._id} -> Exam ${sub.examId} NOT FOUND`);
    if (sub.studentId && mongoose.Types.ObjectId.isValid(sub.studentId) && !(await Student.exists({ _id: sub.studentId }))) orphans.push(`Submission ${sub._id} -> Student ${sub.studentId} NOT FOUND`);
  }

  // Timetable -> Class, Subject, Teacher
  const timetables = await Timetable.find();
  for (const tt of timetables) {
    if (tt.classId && mongoose.Types.ObjectId.isValid(tt.classId) && !(await ClassModel.exists({ _id: tt.classId }))) orphans.push(`Timetable ${tt._id} -> Class ${tt.classId} NOT FOUND`);
    if (tt.subjectId && mongoose.Types.ObjectId.isValid(tt.subjectId) && !(await Subject.exists({ _id: tt.subjectId }))) orphans.push(`Timetable ${tt._id} -> Subject ${tt.subjectId} NOT FOUND`);
    if (tt.teacherId && mongoose.Types.ObjectId.isValid(tt.teacherId) && !(await Teacher.exists({ _id: tt.teacherId }))) orphans.push(`Timetable ${tt._id} -> Teacher ${tt.teacherId} NOT FOUND`);
  }

  // MealMenu -> School
  const meals = await MealMenu.find();
  for (const mm of meals) {
    if (mm.schoolId && mongoose.Types.ObjectId.isValid(mm.schoolId) && !(await School.exists({ _id: mm.schoolId }))) orphans.push(`MealMenu ${mm._id} -> School ${mm.schoolId} NOT FOUND`);
  }

  // Holiday -> School
  const holidays = await Holiday.find();
  for (const h of holidays) {
    if (h.schoolId && mongoose.Types.ObjectId.isValid(h.schoolId) && !(await School.exists({ _id: h.schoolId }))) orphans.push(`Holiday ${h._id} -> School ${h.schoolId} NOT FOUND`);
  }

  console.log('\n==================================================');
  console.log('2. ORPHANED REFERENCES REPORT');
  console.log('==================================================');
  if (orphans.length === 0) {
    console.log('SUCCESS: ZERO orphaned references found in database! All references point to existing documents.');
  } else {
    console.log(`Found ${orphans.length} orphaned references:`);
    orphans.forEach(o => console.log(' - ' + o));
  }

  // Check Classes 1-8
  const classesList = await ClassModel.find().sort({ standard: 1, section: 1 });
  console.log('\n==================================================');
  console.log(`3. CLASSES VERIFICATION (Classes 1-8, Total: ${classesList.length})`);
  console.log('==================================================');
  classesList.forEach(c => console.log(` - Std ${c.standard} | Section: ${c.section} | Name: ${c.className} | Capacity: ${c.capacity}`));

  // Check Subjects
  const subjectsList = await Subject.find().sort({ name: 1 });
  console.log('\n==================================================');
  console.log(`4. SUBJECTS VERIFICATION (Total: ${subjectsList.length})`);
  console.log('==================================================');
  subjectsList.forEach(s => console.log(` - ${s.name} (Code: ${s.code || 'N/A'})`));

  // Check Mid-Day Meals
  console.log('\n==================================================');
  console.log('5. MID-DAY MEAL MENU VERIFICATION');
  console.log('==================================================');
  const mealList = await MealMenu.find().sort({ dayOfWeek: 1 });
  mealList.forEach(m => {
    const day = m.dayName?.en || `Day ${m.dayOfWeek}`;
    const mealGu = m.meal?.gu || m.mealGujarati || (typeof m.meal === 'string' ? m.meal : 'N/A');
    const timeGu = m.time?.gu || m.timeGujarati || (typeof m.time === 'string' ? m.time : '1:30 PM - 2:00 PM');
    console.log(` - Day: ${day.padEnd(10)} | Meal (Gu): ${mealGu} | Time: ${timeGu}`);
  });

  // Check Student-Parent Links
  console.log('\n==================================================');
  console.log('6. STUDENT-PARENT RELATIONSHIPS');
  console.log('==================================================');
  const spList = await StudentParent.find().populate('parentId');
  console.log(`Total relationships: ${spList.length}`);
  for (const sp of spList) {
    const student = await Student.findOne({ studentId: sp.studentId });
    const pName = sp.parentId ? `${sp.parentId.firstName || ''} ${sp.parentId.lastName || ''}`.trim() : 'N/A';
    console.log(` - Parent: ${pName || 'Parent'} (ID: ${sp.parentId?._id}) -> Student: ${student?.name || sp.studentId} (Student ID: ${sp.studentId}) [Rel: ${sp.relationship}]`);
  }

  await mongoose.disconnect();
}

runAudit().catch(console.error);

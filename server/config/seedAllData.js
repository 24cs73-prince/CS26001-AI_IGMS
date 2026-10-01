import { User } from "../models/User.js";
import { School } from "../models/School.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { Exam } from "../models/Exam.js";
import { Notice } from "../models/Notice.js";
import { Attendance } from "../models/Attendance.js";
import { Mark } from "../models/Mark.js";
import { Leave } from "../models/Leave.js";
import { Parent } from "../models/Parent.js";
import { Class } from "../models/Class.js";
import { Subject } from "../models/Subject.js";
import { StudentParent } from "../models/StudentParent.js";
import { Timetable } from "../models/Timetable.js";
import { MealMenu } from "../models/MealMenu.js";
import { Holiday } from "../models/Holiday.js";

export const seedAllData = async () => {
  try {
    console.log("🌱 Populating complete MongoDB Database collections...");

    // 1. SEED SCHOOLS
    const schoolCount = await School.countDocuments();
    if (schoolCount === 0) {
      await School.insertMany([
        {
          school_id: "SCH-001",
          name: "PM Shri Government Higher Secondary School - Gandhinagar",
          udiseCode: "24070100101",
          category: "Higher Secondary",
          address: { district: "Gandhinagar", state: "Gujarat", pincode: "382010" },
          status: "Active",
        },
        {
          school_id: "SCH-002",
          name: "Government Model High School - Ahmedabad",
          udiseCode: "24010100202",
          category: "Secondary",
          address: { district: "Ahmedabad", state: "Gujarat", pincode: "380001" },
          status: "Active",
        },
      ]);
      console.log("✅ Seeded 2 Schools into MongoDB");
    }

    // 2. SEED CLASSES (Classes 1 to 8)
    const classCount = await Class.countDocuments();
    if (classCount === 0) {
      const classesData = [];
      for (let std = 1; std <= 8; std++) {
        classesData.push({
          schoolId: "SCH-001",
          className: `Class ${std}`,
          standard: std,
          section: "A",
          academicYear: "2025-26",
          capacity: 40,
          totalStudents: 35,
          status: "Active",
        });
        classesData.push({
          schoolId: "SCH-001",
          className: `Class ${std}`,
          standard: std,
          section: "B",
          academicYear: "2025-26",
          capacity: 40,
          totalStudents: 32,
          status: "Active",
        });
      }
      await Class.insertMany(classesData);
      console.log("✅ Seeded 16 Classes (Std 1 to 8, Sections A & B) into MongoDB");
    }

    // 3. SEED SUBJECTS
    const subjectCount = await Subject.countDocuments();
    if (subjectCount === 0) {
      await Subject.insertMany([
        { schoolId: "SCH-001", name: "Gujarati", nameGu: "ગુજરાતી", code: "GUJ-101", applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8] },
        { schoolId: "SCH-001", name: "Mathematics", nameGu: "ગણિત", code: "MATH-101", applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8] },
        { schoolId: "SCH-001", name: "Science", nameGu: "વિજ્ઞાન", code: "SCI-101", applicableStandards: [3, 4, 5, 6, 7, 8] },
        { schoolId: "SCH-001", name: "English", nameGu: "અંગ્રેજી", code: "ENG-101", applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8] },
        { schoolId: "SCH-001", name: "Social Science", nameGu: "સામાજિક વિજ્ઞાન", code: "SS-101", applicableStandards: [5, 6, 7, 8] },
        { schoolId: "SCH-001", name: "Hindi", nameGu: "હિન્દી", code: "HIN-101", applicableStandards: [5, 6, 7, 8] },
        { schoolId: "SCH-001", name: "Computer Studies", nameGu: "કમ્પ્યુટર શિક્ષણ", code: "COMP-101", applicableStandards: [5, 6, 7, 8] },
        { schoolId: "SCH-001", name: "Physical Education", nameGu: "શારીરિક શિક્ષણ", code: "PE-101", applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8] },
      ]);
      console.log("✅ Seeded 8 Standard Subjects into MongoDB");
    }

    // 4. SEED STUDENTS
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      const studentData = [
        { studentId: 'STU-1001', name: 'Aarav Sharma', firstName: 'Aarav', lastName: 'Sharma', roll: 1, rollNumber: 1, className: 'Class 6', section: 'A', gender: 'Male', guardian: 'Rajesh Sharma', phone: '+91 98110 22331', email: 'aarav.s@igms.edu', attendance: 96, average: 88, status: 'Active', admissionDate: '2021-04-12' },
        { studentId: 'STU-1002', name: 'Diya Patel', firstName: 'Diya', lastName: 'Patel', roll: 2, rollNumber: 2, className: 'Class 6', section: 'A', gender: 'Female', guardian: 'Nikhil Patel', phone: '+91 98220 11445', email: 'diya.p@igms.edu', attendance: 92, average: 91, status: 'Active', admissionDate: '2021-04-12' },
        { studentId: 'STU-1003', name: 'Vivaan Gupta', firstName: 'Vivaan', lastName: 'Gupta', roll: 3, rollNumber: 3, className: 'Class 6', section: 'A', gender: 'Male', guardian: 'Sunita Gupta', phone: '+91 99530 88210', email: 'vivaan.g@igms.edu', attendance: 78, average: 64, status: 'Active', admissionDate: '2021-04-15' },
        { studentId: 'STU-1004', name: 'Ananya Singh', firstName: 'Ananya', lastName: 'Singh', roll: 4, rollNumber: 4, className: 'Class 5', section: 'B', gender: 'Female', guardian: 'Manoj Singh', phone: '+91 98730 55129', email: 'ananya.s@igms.edu', attendance: 88, average: 79, status: 'Active', admissionDate: '2022-04-10' },
        { studentId: 'STU-1005', name: 'Reyansh Kumar', firstName: 'Reyansh', lastName: 'Kumar', roll: 5, rollNumber: 5, className: 'Class 5', section: 'B', gender: 'Male', guardian: 'Anil Kumar', phone: '+91 90045 33921', email: 'reyansh.k@igms.edu', attendance: 71, average: 58, status: 'Active', admissionDate: '2022-04-10' },
        { studentId: 'STU-1006', name: 'Ishita Reddy', firstName: 'Ishita', lastName: 'Reddy', roll: 6, rollNumber: 6, className: 'Class 8', section: 'A', gender: 'Female', guardian: 'Prasad Reddy', phone: '+91 91000 77820', email: 'ishita.r@igms.edu', attendance: 94, average: 93, status: 'Active', admissionDate: '2019-04-08' },
        { studentId: 'STU-1007', name: 'Kabir Mehta', firstName: 'Kabir', lastName: 'Mehta', roll: 7, rollNumber: 7, className: 'Class 8', section: 'A', gender: 'Male', guardian: 'Farah Mehta', phone: '+91 93150 66412', email: 'kabir.m@igms.edu', attendance: 83, average: 72, status: 'Active', admissionDate: '2019-04-08' },
        { studentId: 'STU-1008', name: 'Saanvi Nair', firstName: 'Saanvi', lastName: 'Nair', roll: 8, rollNumber: 8, className: 'Class 8', section: 'C', gender: 'Female', guardian: 'Deepa Nair', phone: '+91 97440 12093', email: 'saanvi.n@igms.edu', attendance: 90, average: 85, status: 'Active', admissionDate: '2023-04-11' },
        { studentId: 'STU-1009', name: 'Arjun Verma', firstName: 'Arjun', lastName: 'Verma', roll: 9, rollNumber: 9, className: 'Class 8', section: 'C', gender: 'Male', guardian: 'Ravi Verma', phone: '+91 98800 45673', email: 'arjun.v@igms.edu', attendance: 65, average: 49, status: 'Inactive', admissionDate: '2023-04-11' },
        { studentId: 'STU-1010', name: 'Myra Joshi', firstName: 'Myra', lastName: 'Joshi', roll: 10, rollNumber: 10, className: 'Class 7', section: 'A', gender: 'Female', guardian: 'Kiran Joshi', phone: '+91 99900 34512', email: 'myra.j@igms.edu', attendance: 97, average: 95, status: 'Active', admissionDate: '2020-04-09' },
      ];
      await Student.insertMany(studentData);
      console.log("✅ Seeded 10 Students into MongoDB");
    }

    // 5. SEED TEACHERS
    const teacherCount = await Teacher.countDocuments();
    if (teacherCount === 0) {
      const teacherData = [
        { teacherId: 'TCH-201', name: 'Dr. Meenakshi Iyer', department: 'Mathematics', subject: 'Mathematics', experience: 14, email: 'meenakshi.i@igms.edu', phone: '+91 98110 20001', classes: ['Class 6', 'Class 8'], status: 'Active', rating: 4.8 },
        { teacherId: 'TCH-202', name: 'Rakesh Menon', department: 'Science', subject: 'Physics', experience: 11, email: 'rakesh.m@igms.edu', phone: '+91 98220 20002', classes: ['Class 7', 'Class 8'], status: 'Active', rating: 4.6 },
        { teacherId: 'TCH-203', name: 'Sushmita Roy', department: 'Languages', subject: 'English', experience: 9, email: 'sushmita.r@igms.edu', phone: '+91 99530 20003', classes: ['Class 8', 'Class 5'], status: 'Active', rating: 4.7 },
        { teacherId: 'TCH-204', name: 'Arvind Nair', department: 'Social Science', subject: 'History', experience: 16, email: 'arvind.n@igms.edu', phone: '+91 98730 20004', classes: ['Class 5', 'Class 6'], status: 'On Leave', rating: 4.4 },
        { teacherId: 'TCH-205', name: 'Pooja Deshmukh', department: 'Science', subject: 'Chemistry', experience: 8, email: 'pooja.d@igms.edu', phone: '+91 90045 20005', classes: ['Class 7', 'Class 8'], status: 'Active', rating: 4.5 },
      ];
      await Teacher.insertMany(teacherData);
      console.log("✅ Seeded 5 Teachers into MongoDB");
    }

    // 6. SEED PARENTS & STUDENT-PARENT RELATIONSHIPS
    const parentCount = await Parent.countDocuments();
    if (parentCount === 0) {
      const parentUser = await User.findOne({ roleKey: "parent" });
      const parentUserId = parentUser ? parentUser._id : "650000000000000000000005";

      const createdParent = await Parent.create({
        userId: parentUserId,
        parentId: "PAR-301",
        firstName: "Rajesh",
        middleName: "K",
        lastName: "Sharma",
        phone: "+91 98110 22331",
        email: "parent@school.gov.in",
        occupation: "Business Executive",
        status: "Active",
      });

      // Link to student STU-1001 (Aarav Sharma)
      await StudentParent.create({
        studentId: "STU-1001",
        parentId: createdParent._id,
        parentUserId: parentUserId,
        relationship: "Father",
        isPrimary: true,
      });

      console.log("✅ Seeded Parent profiles and StudentParent links into MongoDB");
    }

    // 7. SEED MID-DAY MEAL MENU (Monday to Saturday)
    const mealCount = await MealMenu.countDocuments();
    if (mealCount === 0) {
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
          tag: { en: "Saturday Special Meal", gu: "શનિવારનું વિશેષ ભોજન" },
        },
      ];
      await MealMenu.insertMany(weeklyMeals);
      console.log("✅ Seeded Official Gujarat Mid-Day Meal Menu (Mon-Sat) into MongoDB");
    }

    // 8. SEED HOLIDAYS
    const holidayCount = await Holiday.countDocuments();
    if (holidayCount === 0) {
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
      ]);
      console.log("✅ Seeded Holidays into MongoDB");
    }

    // 9. SEED TIMETABLE
    const timetableCount = await Timetable.countDocuments();
    if (timetableCount === 0) {
      const sampleTimetable = [
        { schoolId: "SCH-001", className: "Class 6", section: "A", dayOfWeek: 1, period: 1, subjectName: "Mathematics", teacherName: "Dr. Meenakshi Iyer", startTime: "08:00 AM", endTime: "08:45 AM", room: "Room 101" },
        { schoolId: "SCH-001", className: "Class 6", section: "A", dayOfWeek: 1, period: 2, subjectName: "Gujarati", teacherName: "Sushmita Roy", startTime: "08:45 AM", endTime: "09:30 AM", room: "Room 101" },
        { schoolId: "SCH-001", className: "Class 6", section: "A", dayOfWeek: 1, period: 3, subjectName: "Science", teacherName: "Rakesh Menon", startTime: "09:45 AM", endTime: "10:30 AM", room: "Room 101" },
        { schoolId: "SCH-001", className: "Class 6", section: "A", dayOfWeek: 1, period: 4, subjectName: "English", teacherName: "Sushmita Roy", startTime: "10:30 AM", endTime: "11:15 AM", room: "Room 101" },
        { schoolId: "SCH-001", className: "Class 6", section: "A", dayOfWeek: 1, period: 5, subjectName: "Social Science", teacherName: "Arvind Nair", startTime: "11:45 AM", endTime: "12:30 PM", room: "Room 101" },
        { schoolId: "SCH-001", className: "Class 6", section: "A", dayOfWeek: 1, period: 6, subjectName: "Computer", teacherName: "Pooja Deshmukh", startTime: "12:30 PM", endTime: "01:15 PM", room: "Computer Lab" },
      ];
      await Timetable.insertMany(sampleTimetable);
      console.log("✅ Seeded Class 6 Timetable into MongoDB");
    }

    // 10. SEED NOTICES
    const noticeCount = await Notice.countDocuments();
    if (noticeCount === 0) {
      await Notice.insertMany([
        {
          title: "Annual Science & Innovation Fair 2026",
          category: "Event",
          audience: "All",
          priority: "Important",
          content: "All students from Class 5 to 8 are invited to participate in the upcoming Science Fair.",
          publishedBy: "Dr. Meenakshi Iyer",
        },
        {
          title: "Mid-Term Examination Schedule Released",
          category: "Examination",
          audience: "All",
          priority: "Important",
          content: "The Mid-Term exam schedule for Class 1 to 8 is published. Please review your timetable.",
          publishedBy: "Rohan Administrator",
        },
      ]);
      console.log("✅ Seeded 2 Notices into MongoDB");
    }

    console.log("🚀 Complete 17-Collection MongoDB Database population ready!");
  } catch (error) {
    console.error("Error seeding MongoDB database:", error);
  }
};

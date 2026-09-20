import { User } from "../models/User.js";
import { School } from "../models/School.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { Exam } from "../models/Exam.js";
import { Notice } from "../models/Notice.js";
import { Attendance } from "../models/Attendance.js";
import { Mark } from "../models/Mark.js";
import { Leave } from "../models/Leave.js";

export const seedAllData = async () => {
  try {
    console.log("🌱 Populating complete MongoDB Database collections...");

    // 1. SEED SCHOOLS
    const schoolCount = await School.countDocuments();
    if (schoolCount === 0) {
      await School.insertMany([
        {
          name: "PM Shri Govt High School - Ahmedabad",
          udiseCode: "24010100101",
          category: "Higher Secondary",
          address: { street: "Main Road", district: "Ahmedabad", state: "Gujarat", pincode: "380001" },
          status: "Active",
        },
        {
          name: "Government Model School - Vadodara",
          udiseCode: "24020100202",
          category: "Secondary",
          address: { street: "Station Road", district: "Vadodara", state: "Gujarat", pincode: "390001" },
          status: "Active",
        },
      ]);
      console.log("✅ Seeded 2 Schools into MongoDB");
    }

    // 2. SEED STUDENTS
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      const studentData = [
        { id: 'STU-1001', name: 'Aarav Sharma', roll: 1, className: 'Class 6', section: 'A', gender: 'Male', guardian: 'Rajesh Sharma', phone: '+91 98110 22331', email: 'aarav.s@igms.edu', attendance: 96, average: 88, status: 'Active', admissionDate: '2021-04-12' },
        { id: 'STU-1002', name: 'Diya Patel', roll: 2, className: 'Class 6', section: 'A', gender: 'Female', guardian: 'Nikhil Patel', phone: '+91 98220 11445', email: 'diya.p@igms.edu', attendance: 92, average: 91, status: 'Active', admissionDate: '2021-04-12' },
        { id: 'STU-1003', name: 'Vivaan Gupta', roll: 3, className: 'Class 6', section: 'A', gender: 'Male', guardian: 'Sunita Gupta', phone: '+91 99530 88210', email: 'vivaan.g@igms.edu', attendance: 78, average: 64, status: 'Active', admissionDate: '2021-04-15' },
        { id: 'STU-1004', name: 'Ananya Singh', roll: 4, className: 'Class 5', section: 'B', gender: 'Female', guardian: 'Manoj Singh', phone: '+91 98730 55129', email: 'ananya.s@igms.edu', attendance: 88, average: 79, status: 'Active', admissionDate: '2022-04-10' },
        { id: 'STU-1005', name: 'Reyansh Kumar', roll: 5, className: 'Class 5', section: 'B', gender: 'Male', guardian: 'Anil Kumar', phone: '+91 90045 33921', email: 'reyansh.k@igms.edu', attendance: 71, average: 58, status: 'Active', admissionDate: '2022-04-10' },
        { id: 'STU-1006', name: 'Ishita Reddy', roll: 6, className: 'Class 8', section: 'A', gender: 'Female', guardian: 'Prasad Reddy', phone: '+91 91000 77820', email: 'ishita.r@igms.edu', attendance: 94, average: 93, status: 'Active', admissionDate: '2019-04-08' },
        { id: 'STU-1007', name: 'Kabir Mehta', roll: 7, className: 'Class 8', section: 'A', gender: 'Male', guardian: 'Farah Mehta', phone: '+91 93150 66412', email: 'kabir.m@igms.edu', attendance: 83, average: 72, status: 'Active', admissionDate: '2019-04-08' },
        { id: 'STU-1008', name: 'Saanvi Nair', roll: 8, className: 'Class 8', section: 'C', gender: 'Female', guardian: 'Deepa Nair', phone: '+91 97440 12093', email: 'saanvi.n@igms.edu', attendance: 90, average: 85, status: 'Active', admissionDate: '2023-04-11' },
        { id: 'STU-1009', name: 'Arjun Verma', roll: 9, className: 'Class 8', section: 'C', gender: 'Male', guardian: 'Ravi Verma', phone: '+91 98800 45673', email: 'arjun.v@igms.edu', attendance: 65, average: 49, status: 'Inactive', admissionDate: '2023-04-11' },
        { id: 'STU-1010', name: 'Myra Joshi', roll: 10, className: 'Class 7', section: 'A', gender: 'Female', guardian: 'Kiran Joshi', phone: '+91 99900 34512', email: 'myra.j@igms.edu', attendance: 97, average: 95, status: 'Active', admissionDate: '2020-04-09' },
      ];
      await Student.insertMany(studentData.map(s => ({ ...s, studentId: s.id })));
      console.log("✅ Seeded 10 Students into MongoDB");
    }

    // 3. SEED TEACHERS
    const teacherCount = await Teacher.countDocuments();
    if (teacherCount === 0) {
      const teacherData = [
        { id: 'TCH-201', name: 'Dr. Meenakshi Iyer', department: 'Mathematics', subject: 'Mathematics', experience: 14, email: 'meenakshi.i@igms.edu', phone: '+91 98110 20001', classes: ['Class 6', 'Class 8'], status: 'Active', rating: 4.8 },
        { id: 'TCH-202', name: 'Rakesh Menon', department: 'Science', subject: 'Physics', experience: 11, email: 'rakesh.m@igms.edu', phone: '+91 98220 20002', classes: ['Class 7', 'Class 8'], status: 'Active', rating: 4.6 },
        { id: 'TCH-203', name: 'Sushmita Roy', department: 'Languages', subject: 'English', experience: 9, email: 'sushmita.r@igms.edu', phone: '+91 99530 20003', classes: ['Class 8', 'Class 5'], status: 'Active', rating: 4.7 },
        { id: 'TCH-204', name: 'Arvind Nair', department: 'Social Science', subject: 'History', experience: 16, email: 'arvind.n@igms.edu', phone: '+91 98730 20004', classes: ['Class 5', 'Class 6'], status: 'On Leave', rating: 4.4 },
        { id: 'TCH-205', name: 'Pooja Deshmukh', department: 'Science', subject: 'Chemistry', experience: 8, email: 'pooja.d@igms.edu', phone: '+91 90045 20005', classes: ['Class 7', 'Class 8'], status: 'Active', rating: 4.5 },
      ];
      await Teacher.insertMany(teacherData.map(t => ({ ...t, teacherId: t.id })));
      console.log("✅ Seeded 5 Teachers into MongoDB");
    }

    // 4. SEED NOTICES
    const noticeCount = await Notice.countDocuments();
    if (noticeCount === 0) {
      await Notice.insertMany([
        {
          title: "Annual Science & Innovation Fair 2026",
          category: "Event",
          audience: "All",
          priority: "High",
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

    console.log("🚀 Complete MongoDB Database population ready!");
  } catch (error) {
    console.error("Error seeding MongoDB database:", error);
  }
};

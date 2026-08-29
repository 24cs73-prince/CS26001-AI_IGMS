/**
 * Database seeder — creates a Super Admin + a demo school + demo
 * principal/teacher/student/parent so you can test immediately.
 *
 * Run:  npm run seed
 */
import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Force Google DNS for SRV resolution (fixes Atlas SRV lookup failures)
dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from '../models/User.js';
import School from '../models/School.js';

const MONGO_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data (BE CAREFUL — only for dev!)
    await User.deleteMany({});
    await School.deleteMany({});
    console.log('🗑️  Cleared existing users & schools');

    // ── 1. Super Admin ────────────────────────────────────────
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@igms.gov.in',
      password: 'Admin@123',
      role: 'super_admin',
      phone: '9999999999',
    });
    console.log('👑 Super Admin created:', superAdmin.email);

    // ── 2. Demo School ────────────────────────────────────────
    const school = await School.create({
      name: 'Government Model School, Ahmedabad',
      code: 'GMS-AHM-001',
      address: {
        street: 'Education Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
      },
      phone: '079-26300001',
      email: 'gms.ahmedabad@edu.gov.in',
    });
    console.log('🏫 School created:', school.name);

    // ── 3. Principal ──────────────────────────────────────────
    const principal = await User.create({
      name: 'Dr. Meena Patel',
      email: 'principal@igms.gov.in',
      password: 'Principal@123',
      role: 'principal',
      phone: '9876543210',
      school_id: school._id,
    });

    // Link principal to school
    school.principal_id = principal._id;
    await school.save();
    console.log('🎓 Principal created:', principal.email);

    // ── 4. Teacher ────────────────────────────────────────────
    const teacher = await User.create({
      name: 'Rajesh Kumar',
      email: 'teacher@igms.gov.in',
      password: 'Teacher@123',
      role: 'teacher',
      phone: '9876543211',
      school_id: school._id,
      subjects: ['Mathematics', 'Science'],
      classes_assigned: ['10-A', '10-B', '9-A'],
    });
    console.log('📚 Teacher created:', teacher.email);

    // ── 5. Student ────────────────────────────────────────────
    const student = await User.create({
      name: 'Arjun Sharma',
      email: 'student@igms.gov.in',
      password: 'Student@123',
      role: 'student',
      phone: '9876543212',
      school_id: school._id,
      class_name: '10',
      section: 'A',
      roll_no: '101',
    });
    console.log('🎒 Student created:', student.email);

    // ── 6. Parent ─────────────────────────────────────────────
    const parent = await User.create({
      name: 'Vikram Sharma',
      email: 'parent@igms.gov.in',
      password: 'Parent@123',
      role: 'parent',
      phone: '9876543213',
      school_id: school._id,
      children: [student._id],
    });
    console.log('👨‍👧 Parent created:', parent.email);

    // Update school stats
    school.totalStudents = 1;
    school.totalTeachers = 1;
    await school.save();

    console.log('\n══════════════════════════════════════════');
    console.log('  ✅ SEED COMPLETE — Demo Credentials');
    console.log('══════════════════════════════════════════');
    console.log('  Super Admin  : admin@igms.gov.in     / Admin@123');
    console.log('  Principal    : principal@igms.gov.in  / Principal@123');
    console.log('  Teacher      : teacher@igms.gov.in    / Teacher@123');
    console.log('  Student      : student@igms.gov.in    / Student@123');
    console.log('  Parent       : parent@igms.gov.in     / Parent@123');
    console.log('══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();

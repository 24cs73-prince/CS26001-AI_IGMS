import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { School } from "./models/School.js";
import { Student } from "./models/Student.js";
import { Teacher } from "./models/Teacher.js";
import { Parent } from "./models/Parent.js";
import { Class } from "./models/Class.js";
import { Subject } from "./models/Subject.js";
import { StudentParent } from "./models/StudentParent.js";
import { Attendance } from "./models/Attendance.js";
import { Mark } from "./models/Mark.js";
import { Exam } from "./models/Exam.js";
import { Submission } from "./models/Submission.js";
import { Leave } from "./models/Leave.js";
import { Notice } from "./models/Notice.js";
import { Timetable } from "./models/Timetable.js";
import { MealMenu } from "./models/MealMenu.js";
import { Holiday } from "./models/Holiday.js";
import { seedAllData } from "./config/seedAllData.js";

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const atlasUri = process.env.MONGODB_ATLAS_URI || "mongodb+srv://AI_IGMS_SGP5:AI_IGMS_SGP5@ai-igms.fbka6kv.mongodb.net/ai_igms?retryWrites=true&w=majority";
const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/ai_igms";

async function verifyDatabase() {
  console.log("==================================================");
  console.log("🔍 MONGODB VERIFICATION & POPULATION RUNNER");
  console.log("==================================================");

  let targetUri = localUri;
  let connType = "Local MongoDB (127.0.0.1:27017)";

  try {
    const testLocal = await mongoose.createConnection(localUri, { serverSelectionTimeoutMS: 2000 }).asPromise();
    await testLocal.close();
  } catch (err) {
    console.log("Local 127.0.0.1 not reachable, testing Atlas...");
    targetUri = atlasUri;
    connType = "Atlas Cloud";
  }

  // Connect primary mongoose
  const conn = await mongoose.connect(targetUri);
  console.log(`✅ MongoDB connected successfully`);
  console.log(`Database: ${conn.connection.name}`);
  console.log(`Connection Host: ${conn.connection.host} (${connType})`);

  // Run complete seed
  console.log("\n🌱 Running seedAllData()...");
  await seedAllData();

  // Also sync to both if local and atlas available
  try {
    const localConn = await mongoose.createConnection(localUri, { serverSelectionTimeoutMS: 2000 }).asPromise();
    const atlasConn = await mongoose.createConnection(atlasUri, { serverSelectionTimeoutMS: 4000 }).asPromise();

    const localCols = await localConn.db.listCollections().toArray();
    for (const col of localCols) {
      if (col.name.startsWith("system.")) continue;
      const docs = await localConn.db.collection(col.name).find({}).toArray();
      const aCol = atlasConn.db.collection(col.name);
      for (const d of docs) {
        await aCol.replaceOne({ _id: d._id }, d, { upsert: true });
      }
    }
    console.log("✅ Dual-sync to Local and Atlas completed successfully.");
    await localConn.close();
    await atlasConn.close();
  } catch (e) {
    console.log("Note on dual sync:", e.message);
  }

  // Query actual MongoDB collections
  const rawCollections = await conn.connection.db.listCollections().toArray();
  const collectionNames = rawCollections.map((c) => c.name).sort();

  console.log("\n==================================================");
  console.log(`📊 ACTUAL COLLECTIONS IN DATABASE '${conn.connection.name}':`);
  console.log("==================================================");

  const modelMap = [
    { model: "User", schemaModel: User, expectedCol: "users" },
    { model: "School", schemaModel: School, expectedCol: "schools" },
    { model: "Student", schemaModel: Student, expectedCol: "students" },
    { model: "Teacher", schemaModel: Teacher, expectedCol: "teachers" },
    { model: "Parent", schemaModel: Parent, expectedCol: "parents" },
    { model: "Class", schemaModel: Class, expectedCol: "classes" },
    { model: "Subject", schemaModel: Subject, expectedCol: "subjects" },
    { model: "StudentParent", schemaModel: StudentParent, expectedCol: "studentparents" },
    { model: "Attendance", schemaModel: Attendance, expectedCol: "attendances" },
    { model: "Mark", schemaModel: Mark, expectedCol: "marks" },
    { model: "Exam", schemaModel: Exam, expectedCol: "exams" },
    { model: "Submission", schemaModel: Submission, expectedCol: "submissions" },
    { model: "Leave", schemaModel: Leave, expectedCol: "leaves" },
    { model: "Notice", schemaModel: Notice, expectedCol: "notices" },
    { model: "Timetable", schemaModel: Timetable, expectedCol: "timetables" },
    { model: "MealMenu", schemaModel: MealMenu, expectedCol: "mealmenus" },
    { model: "Holiday", schemaModel: Holiday, expectedCol: "holidays" },
  ];

  for (const m of modelMap) {
    const count = await m.schemaModel.countDocuments();
    const exists = collectionNames.includes(m.expectedCol);
    console.log(`- Collection: '${m.expectedCol.padEnd(16)}' | Exists in DB: ${exists ? "YES" : "NO "} | Doc Count: ${count}`);
  }

  console.log("\nTotal collections reported by MongoDB db.listCollections():", collectionNames.length);
  console.log("All Collection Names in MongoDB:", collectionNames);

  await mongoose.disconnect();
  console.log("\nVerification finished cleanly.");
}

verifyDatabase().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});

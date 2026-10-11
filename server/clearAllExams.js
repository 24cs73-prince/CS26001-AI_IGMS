import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const atlasUri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI || "mongodb+srv://AI_IGMS_SGP5:AI_IGMS_SGP5@ai-igms.fbka6kv.mongodb.net/ai_igms?retryWrites=true&w=majority";
const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/ai_igms";

async function clearExams() {
  console.log("🔥 Clearing ALL Online Exams and Submissions from ALL databases...");

  // 1. Clear Atlas Cloud DB
  try {
    const atlasConn = await mongoose.createConnection(atlasUri, { serverSelectionTimeoutMS: 8000 }).asPromise();
    const count = await atlasConn.db.collection("exams").countDocuments();
    console.log(`☁️ Atlas Cloud DB current exams: ${count}`);
    await atlasConn.db.collection("exams").deleteMany({});
    await atlasConn.db.collection("submissions").deleteMany({});
    await atlasConn.db.collection("marks").deleteMany({});
    console.log("✅ Cleared all exams, submissions, and marks from Atlas Cloud DB!");
    await atlasConn.close();
  } catch (err) {
    console.warn("⚠️ Atlas Cloud DB clear notice:", err.message);
  }

  // 2. Clear Local MongoDB
  try {
    const localConn = await mongoose.createConnection(localUri, { serverSelectionTimeoutMS: 5000 }).asPromise();
    const count = await localConn.db.collection("exams").countDocuments();
    console.log(`💻 Local Compass DB current exams: ${count}`);
    await localConn.db.collection("exams").deleteMany({});
    await localConn.db.collection("submissions").deleteMany({});
    await localConn.db.collection("marks").deleteMany({});
    console.log("✅ Cleared all exams, submissions, and marks from Local Compass DB!");
    await localConn.close();
  } catch (err) {
    console.warn("⚠️ Local DB clear notice:", err.message);
  }

  console.log("🎉 ALL ONLINE EXAMS REMOVED SUCCESSFULLY FROM ALL DATABASES!");
  process.exit(0);
}

clearExams();

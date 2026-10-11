import fs from "fs";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";

async function backup() {
  await connectDB();
  const backupData = {};
  const collections = Object.keys(mongoose.connection.collections);

  for (const name of collections) {
    const docs = await mongoose.connection.collections[name].find({}).toArray();
    backupData[name] = docs;
    console.log(`📦 Backed up '${name}': ${docs.length} documents`);
  }

  fs.writeFileSync("./server/db_backup.json", JSON.stringify(backupData, null, 2));
  console.log("✅ FULL DB BACKUP COMPLETED -> server/db_backup.json");
  process.exit(0);
}

backup();

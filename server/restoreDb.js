import fs from "fs";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";

async function restore() {
  await connectDB();
  if (!fs.existsSync("./server/db_backup.json")) {
    console.error("❌ No backup file found at server/db_backup.json!");
    process.exit(1);
  }

  const backupData = JSON.parse(fs.readFileSync("./server/db_backup.json", "utf-8"));
  const collections = Object.keys(backupData);

  for (const name of collections) {
    const docs = backupData[name];
    if (mongoose.connection.collections[name]) {
      await mongoose.connection.collections[name].deleteMany({});
      if (docs && docs.length > 0) {
        // Convert string _ids back to ObjectIds if needed
        const formattedDocs = docs.map((doc) => {
          if (doc._id && typeof doc._id === "string") {
            try {
              doc._id = new mongoose.Types.ObjectId(doc._id);
            } catch (e) {}
          }
          return doc;
        });
        await mongoose.connection.collections[name].insertMany(formattedDocs);
      }
      console.log(`🔄 Restored '${name}': ${docs.length} documents`);
    }
  }

  console.log("✨ DB RESTORE COMPLETED SUCCESSFULLY!");
  process.exit(0);
}

restore();

import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const atlasUri = process.env.MONGODB_ATLAS_URI || "mongodb+srv://AI_IGMS_SGP5:AI_IGMS_SGP5@ai-igms.fbka6kv.mongodb.net/ai_igms?retryWrites=true&w=majority";
const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/ai_igms";

async function syncAll() {
  console.log("📡 Connecting to Local MongoDB Compass and MongoDB Atlas Cloud...");
  const localConn = await mongoose.createConnection(localUri).asPromise();
  const atlasConn = await mongoose.createConnection(atlasUri).asPromise();

  const localCols = await localConn.db.listCollections().toArray();
  console.log("Local collections to sync:", localCols.map((c) => c.name));

  for (const col of localCols) {
    const colName = col.name;
    if (colName.startsWith("system.")) continue;

    const localDocs = await localConn.db.collection(colName).find({}).toArray();
    const atlasCol = atlasConn.db.collection(colName);

    console.log(`Syncing ${colName} (${localDocs.length} docs)...`);
    for (const doc of localDocs) {
      await atlasCol.replaceOne({ _id: doc._id }, doc, { upsert: true });
    }

    const count = await atlasCol.countDocuments();
    console.log(`✅ ${colName}: ${count} docs now in Atlas Cloud!`);
  }

  await localConn.close();
  await atlasConn.close();
  console.log("🎉 SUCCESS: All local MongoDB collections are 100% synchronized to MongoDB Atlas Cloud!");
}

syncAll().catch(console.error);

import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore DNS override errors
}

export const syncLocalToAtlas = async (atlasUri) => {
  if (!atlasUri || atlasUri.includes("<db_password>")) {
    console.warn("⚠️ MONGODB_ATLAS_URI contains <db_password> placeholder!");
    return false;
  }

  const cleanAtlasUri = atlasUri.trim().replace(/\\+$/, '');
  const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/ai_igms";

  try {
    const localConn = await mongoose.createConnection(localUri, { serverSelectionTimeoutMS: 5000 }).asPromise();
    const atlasConn = await mongoose.createConnection(cleanAtlasUri, { serverSelectionTimeoutMS: 5000 }).asPromise();

    const localCols = await localConn.db.listCollections().toArray();
    const atlasCols = await atlasConn.db.listCollections().toArray();

    // 1. Sync Local -> Atlas (upsert)
    for (const col of localCols) {
      const colName = col.name;
      if (colName.startsWith("system.")) continue;
      const docs = await localConn.db.collection(colName).find({}).toArray();
      if (docs.length > 0) {
        const atlasCol = atlasConn.db.collection(colName);
        for (const doc of docs) {
          await atlasCol.replaceOne({ _id: doc._id }, doc, { upsert: true });
        }
      }
    }

    // 2. Sync Atlas -> Local (upsert back so local Compass is ALWAYS 100% updated with Atlas)
    for (const col of atlasCols) {
      const colName = col.name;
      if (colName.startsWith("system.")) continue;
      const docs = await atlasConn.db.collection(colName).find({}).toArray();
      if (docs.length > 0) {
        const localCol = localConn.db.collection(colName);
        for (const doc of docs) {
          await localCol.replaceOne({ _id: doc._id }, doc, { upsert: true });
        }
      }
    }

    await localConn.close();
    await atlasConn.close();
    console.log("⚡ BIDIRECTIONAL SYNC COMPLETE: Local MongoDB Compass & Atlas Cloud are 100% synchronized!");
    return true;
  } catch (err) {
    console.error("❌ Dual sync error:", err.message);
    return false;
  }
};

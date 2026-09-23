import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

let isSyncing = false;

/**
 * Perform a 2-way sync between Local MongoDB (127.0.0.1:27017) and Atlas Cloud
 */
export async function syncBothDatabases() {
  if (isSyncing) return;
  isSyncing = true;

  const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/ai_igms";
  let atlasUri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

  if (!atlasUri || atlasUri.includes("<db_password>")) {
    isSyncing = false;
    return;
  }
  atlasUri = atlasUri.trim().replace(/\\+$/, '');

  try {
    const localConn = await mongoose.createConnection(localUri, { serverSelectionTimeoutMS: 3000 }).asPromise();
    const atlasConn = await mongoose.createConnection(atlasUri, { serverSelectionTimeoutMS: 3000 }).asPromise();

    const localCols = await localConn.db.listCollections().toArray();
    const atlasCols = await atlasConn.db.listCollections().toArray();

    const allColNames = new Set([
      ...localCols.map(c => c.name),
      ...atlasCols.map(c => c.name)
    ]);

    for (const colName of allColNames) {
      if (colName.startsWith("system.")) continue;

      const localCol = localConn.db.collection(colName);
      const atlasCol = atlasConn.db.collection(colName);

      const localDocs = await localCol.find({}).toArray();
      const atlasDocs = await atlasCol.find({}).toArray();

      const localMap = new Map(localDocs.map(d => [d._id.toString(), d]));
      const atlasMap = new Map(atlasDocs.map(d => [d._id.toString(), d]));

      // 1. If doc is in Atlas but missing/outdated in Local -> write to Local
      for (const [id, aDoc] of atlasMap.entries()) {
        const lDoc = localMap.get(id);
        if (!lDoc || JSON.stringify(lDoc) !== JSON.stringify(aDoc)) {
          await localCol.replaceOne({ _id: aDoc._id }, aDoc, { upsert: true });
        }
      }

      // 2. If doc is in Local but missing/outdated in Atlas -> write to Atlas
      for (const [id, lDoc] of localMap.entries()) {
        const aDoc = atlasMap.get(id);
        if (!aDoc || JSON.stringify(aDoc) !== JSON.stringify(lDoc)) {
          await atlasCol.replaceOne({ _id: lDoc._id }, lDoc, { upsert: true });
        }
      }
    }

    await localConn.close();
    await atlasConn.close();
  } catch (err) {
    // Silent fail on background sync error to avoid spamming logs
  } finally {
    isSyncing = false;
  }
}

/**
 * Start background automatic sync loop running every 5 seconds
 */
export function startAutoSyncLoop(intervalMs = 5000) {
  console.log(`🔄 Started Live 2-Way Sync Loop (Every ${intervalMs / 1000}s) between Local Compass (127.0.0.1) & Atlas Cloud`);
  // Run immediately on start
  syncBothDatabases();
  // Set interval
  setInterval(() => {
    syncBothDatabases();
  }, intervalMs);
}

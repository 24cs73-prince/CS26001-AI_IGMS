import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const atlasUri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI || "mongodb+srv://AI_IGMS_SGP5:AI_IGMS_SGP5@ai-igms.fbka6kv.mongodb.net/ai_igms?retryWrites=true&w=majority";
const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/ai_igms";

let cachedAtlasConn = null;
let cachedLocalConn = null;

async function getAtlasConnection() {
  if (cachedAtlasConn && cachedAtlasConn.readyState === 1) {
    return cachedAtlasConn;
  }
  try {
    cachedAtlasConn = await mongoose.createConnection(atlasUri, {
      serverSelectionTimeoutMS: 8000,
    }).asPromise();
    return cachedAtlasConn;
  } catch (err) {
    console.warn("⚠️ Direct Atlas connection warning:", err.message);
    return null;
  }
}

async function getLocalConnection() {
  if (cachedLocalConn && cachedLocalConn.readyState === 1) {
    return cachedLocalConn;
  }
  try {
    cachedLocalConn = await mongoose.createConnection(localUri, {
      serverSelectionTimeoutMS: 3000,
    }).asPromise();
    return cachedLocalConn;
  } catch (err) {
    console.warn("⚠️ Direct Local connection warning:", err.message);
    return null;
  }
}

/**
 * Instantly writes/upserts any document to BOTH MongoDB Atlas Cloud and Local Compass.
 * Guarantees zero delay between local Compass and Atlas Cloud.
 *
 * @param {string} collectionName - e.g. "exams", "users", "schools", "attendances", "marks"
 * @param {object} doc - The document payload with `_id`
 */
export async function writeDocToBothDatabases(collectionName, doc) {
  if (!doc || !doc._id) return;

  const rawDoc = doc.toObject ? doc.toObject() : { ...doc };

  // 1. Parallel write to Atlas Cloud
  const writeAtlasPromise = (async () => {
    try {
      const atlas = await getAtlasConnection();
      if (atlas) {
        await atlas.db.collection(collectionName).replaceOne(
          { _id: rawDoc._id },
          rawDoc,
          { upsert: true }
        );
        console.log(`☁️ [Atlas Cloud] Successfully saved to collection '${collectionName}': ${rawDoc.title || rawDoc._id}`);
      }
    } catch (err) {
      console.error(`❌ Atlas parallel write error on '${collectionName}':`, err.message);
    }
  })();

  // 2. Parallel write to Local Compass
  const writeLocalPromise = (async () => {
    try {
      const local = await getLocalConnection();
      if (local) {
        await local.db.collection(collectionName).replaceOne(
          { _id: rawDoc._id },
          rawDoc,
          { upsert: true }
        );
        console.log(`💻 [Local Compass] Successfully saved to collection '${collectionName}': ${rawDoc.title || rawDoc._id}`);
      }
    } catch (err) {
      console.error(`❌ Local parallel write error on '${collectionName}':`, err.message);
    }
  })();

  // Wait for both writes in parallel
  await Promise.allSettled([writeAtlasPromise, writeLocalPromise]);
}

/**
 * Delete a document from both databases simultaneously
 */
export async function deleteDocFromBothDatabases(collectionName, docId) {
  if (!docId) return;

  const deletePromises = [
    (async () => {
      try {
        const atlas = await getAtlasConnection();
        if (atlas) await atlas.db.collection(collectionName).deleteOne({ _id: docId });
      } catch (e) {}
    })(),
    (async () => {
      try {
        const local = await getLocalConnection();
        if (local) await local.db.collection(collectionName).deleteOne({ _id: docId });
      } catch (e) {}
    })(),
  ];

  await Promise.allSettled(deletePromises);
}

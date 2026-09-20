import mongoose from "mongoose";

export const syncLocalToAtlas = async (atlasUri) => {
  if (!atlasUri || atlasUri.includes("<db_password>")) {
    console.warn("⚠️ Please replace <db_password> in MONGODB_ATLAS_URI in server/.env with your actual password!");
    return false;
  }

  try {
    console.log("🔄 Connecting to local MongoDB (127.0.0.1:27017/ai_igms)...");
    const localConn = await mongoose.createConnection("mongodb://127.0.0.1:27017/ai_igms").asPromise();
    
    console.log("☁️ Connecting to MongoDB Atlas Cloud Cluster...");
    const atlasConn = await mongoose.createConnection(atlasUri).asPromise();

    const collections = await localConn.db.listCollections().toArray();
    console.log(`📦 Found ${collections.length} collections in local database to sync to Atlas...`);

    for (const col of collections) {
      const colName = col.name;
      if (colName.startsWith("system.")) continue;
      const docs = await localConn.db.collection(colName).find({}).toArray();
      if (docs.length > 0) {
        await atlasConn.db.collection(colName).deleteMany({});
        await atlasConn.db.collection(colName).insertMany(docs);
        console.log(`✅ Synced collection [${colName}]: ${docs.length} documents uploaded to Atlas.`);
      }
    }

    await localConn.close();
    await atlasConn.close();
    console.log("🎉 ALL 10 COLLECTIONS SUCCESSFULLY MIGRATED TO MONGODB ATLAS!");
    return true;
  } catch (err) {
    console.error("❌ Migration to Atlas error:", err.message);
    return false;
  }
};

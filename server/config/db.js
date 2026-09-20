import mongoose from "mongoose";
import dns from "dns";
import { startAutoSyncLoop, syncBothDatabases } from "./autoSync.js";

// Ensure Node.js uses Google & Cloudflare public DNS for Atlas SRV record resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore DNS override errors
}

let secondaryConn = null;

export const connectDB = async () => {
  const atlasUri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
  const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/ai_igms";

  const isValidAtlas = atlasUri && !atlasUri.includes("<db_password>");

  if (isValidAtlas) {
    try {
      console.log(`📡 Connecting primary database to MongoDB Atlas Cloud Cluster...`);
      const conn = await mongoose.connect(atlasUri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`✅ Primary Database (Atlas Cloud) Connected [${conn.connection.name}]: ${conn.connection.host}`);

      // Establish secondary connection to Local MongoDB for instant parallel dual-write
      try {
        secondaryConn = await mongoose.createConnection(localUri, {
          serverSelectionTimeoutMS: 3000,
        }).asPromise();
        console.log(`⚡ Secondary Database (Local Compass 127.0.0.1) Connected for parallel dual-write!`);
      } catch (secErr) {
        console.warn(`⚠️ Local MongoDB secondary connection failed: ${secErr.message}`);
      }

      // Initial full 2-way sync on startup
      await syncBothDatabases();

      // Start continuous background auto-sync loop (every 3 seconds)
      startAutoSyncLoop(3000);
      return;
    } catch (error) {
      console.warn(`⚠️ Atlas connection failed: ${error.message}. Falling back to local MongoDB...`);
    }
  } else {
    console.log(`ℹ️ MONGODB_ATLAS_URI contains <db_password> placeholder. Using local MongoDB.`);
  }

  // Fallback to local MongoDB
  try {
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ Local MongoDB Connected [Database: ${conn.connection.name}]: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
  }
};

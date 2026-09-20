import mongoose from "mongoose";
import dns from "dns";

// Ensure Node.js uses Google & Cloudflare public DNS for Atlas SRV record resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore DNS override errors if in restricted environment
}

export const connectDB = async () => {
  const atlasUri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
  const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/ai_igms";

  // Check if atlasUri is configured and doesn't contain unreplaced placeholder <db_password>
  const isValidAtlas = atlasUri && !atlasUri.includes("<db_password>");

  if (isValidAtlas) {
    try {
      console.log(`📡 Connecting to MongoDB Atlas Cloud Cluster...`);
      const conn = await mongoose.connect(atlasUri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB Atlas Connected [Database: ${conn.connection.name}]: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`⚠️ Atlas connection failed: ${error.message}. Falling back to local MongoDB...`);
    }
  } else {
    console.log(`ℹ️ MONGODB_ATLAS_URI contains <db_password> placeholder. Using local MongoDB until password is set.`);
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


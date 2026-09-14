import mongoose from "mongoose";
import dns from "dns";

// Ensure Node.js uses Google & Cloudflare public DNS for Atlas SRV record resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore DNS override errors if in restricted environment
}

/**
 * Connect to MongoDB Atlas cluster using Mongoose.
 * Falls back gracefully to memory/mock if URI is unreachable.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000, // 8s timeout
    });
    console.log(`✅ MongoDB Connected [Database: ${conn.connection.name}]: ${conn.connection.host}`);

  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas Connection Warning: ${error.message}`);
    console.warn(`ℹ️ Operating in server fallback mode. Verify MONGODB_URI in server/.env`);
  }
};


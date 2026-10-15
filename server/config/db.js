import mongoose from "mongoose";

/**
 * MongoDB Connection Handler
 * Connects to MongoDB Atlas (Production) or local MongoDB instance (Development)
 * based on process.env.MONGODB_URI or process.env.MONGO_URI.
 */
export const connectDB = async () => {
  const configuredMongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGODB_ATLAS_URI;

  if (process.env.NODE_ENV === "production" && !configuredMongoUri) {
    throw new Error("MONGODB_URI must be configured in production.");
  }

  let mongoUri = configuredMongoUri || "mongodb://127.0.0.1:27017/ai_igms";
  if (mongoUri.includes("<db_password>")) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI contains an unresolved password placeholder.");
    }
    console.warn("⚠️ MongoDB URI contains a placeholder. Using local development MongoDB.");
    mongoUri = "mongodb://127.0.0.1:27017/ai_igms";
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`✅ MongoDB Connected [Database: ${conn.connection.name}]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If not production and URI failed, attempt local fallback
    if (process.env.NODE_ENV !== "production" && !mongoUri.includes("127.0.0.1")) {
      try {
        console.log("ℹ️ Attempting connection to local MongoDB (127.0.0.1:27017)...");
        const localConn = await mongoose.connect("mongodb://127.0.0.1:27017/ai_igms", {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}/${localConn.connection.name}`);
        return localConn;
      } catch (localErr) {
        console.error(`❌ Local fallback also failed: ${localErr.message}`);
      }
    }
    throw error;
  }
};

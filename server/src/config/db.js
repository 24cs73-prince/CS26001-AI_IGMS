import dns from 'node:dns';
import mongoose from 'mongoose';
import config from './index.js';

// ── Force Google DNS for SRV lookups (fixes networks where default
//    DNS cannot resolve MongoDB Atlas SRV records) ────────────────
dns.setServers(['8.8.8.8', '8.8.4.4']);

/**
 * Connect to MongoDB Atlas.
 * Mongoose 8+ no longer needs useNewUrlParser / useUnifiedTopology options.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed (SIGINT)');
  process.exit(0);
});

export default connectDB;

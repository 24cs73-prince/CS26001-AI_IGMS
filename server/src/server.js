import app from './app.js';
import config from './config/index.js';
import connectDB from './config/db.js';

const start = async () => {
  // 1. Connect to MongoDB Atlas
  await connectDB();

  // 2. Start Express server
  app.listen(config.port, () => {
    console.log(`
  ╔══════════════════════════════════════════════╗
  ║     AI-IGMS Server is running 🚀            ║
  ║                                              ║
  ║     Port : ${String(config.port).padEnd(33)}║
  ║     Env  : ${String(config.nodeEnv).padEnd(33)}║
  ║     API  : http://localhost:${config.port}/api       ║
  ╚══════════════════════════════════════════════╝
    `);
  });
};

start();

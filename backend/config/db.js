import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.log('⚡ No external MONGO_URI specified. Starting embedded MongoMemoryServer for development...');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log(`📦 Embedded MongoDB initialized at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️ Standard Mongo connection failed (${error.message}). Falling back to MongoMemoryServer...`);
    try {
      mongod = await MongoMemoryServer.create();
      const fallbackUri = mongod.getUri();
      const conn = await mongoose.connect(fallbackUri);
      console.log(`✅ Fallback MongoMemoryServer connected at: ${conn.connection.host}`);
    } catch (fallbackErr) {
      console.error('❌ Could not establish MongoDB connection:', fallbackErr);
      process.exit(1);
    }
  }
};

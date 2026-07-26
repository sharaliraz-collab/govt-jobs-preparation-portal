import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/govt_portal';

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(mongoUri, opts)
      .then((mongooseInstance) => {
        console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      })
      .catch(async (error) => {
        console.warn(`Primary MONGO_URI failed (${error.message}). Attempting memory server fallback...`);
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const mongod = await MongoMemoryServer.create();
          const memoryUri = mongod.getUri();
          console.log(`Starting MongoDB Memory Server at ${memoryUri}`);
          const memConn = await mongoose.connect(memoryUri, opts);
          return memConn;
        } catch (fallbackErr: any) {
          console.error('Fallback MongoDB Error:', fallbackErr.message);
          cached.promise = null;
          throw fallbackErr;
        }
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // Trigger auto-seeding once connected
  try {
    const { seedAllData } = await import('./seed');
    await seedAllData();
  } catch (seedErr: any) {
    console.error('Auto seed execution error:', seedErr.message);
  }

  return cached.conn;
}

export default connectDB;

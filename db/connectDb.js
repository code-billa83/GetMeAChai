import mongoose from "mongoose";

/**
 * Global cache for the Mongoose connection in serverless / Next.js Fast Refresh environments.
 * Prevents multiple connections being created on every API route / Server Action invocation.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isFallback: false };
}

const connectDb = async () => {
  // If connection is already established, reuse it immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/mishra_db";

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 4000, // Fail fast if local MongoDB service is not started
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        console.log(`[Database] MongoDB Connected successfully to: ${m.connection.host}/${m.connection.name}`);
        cached.isFallback = false;
        return m;
      })
      .catch((err) => {
        console.warn(`[Database Warning] Could not connect to MongoDB at "${uri}": ${err.message}`);
        console.warn(`[Database Notice] Falling back to resilient in-memory store for local testing.`);
        cached.promise = null;
        cached.isFallback = true;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.isFallback = true;
    console.error("[Database Error] Connection attempt failed:", error.message);
  }

  return cached.conn;
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

export default connectDb;

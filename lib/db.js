import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  try {
    cached.conn = await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected");
    return cached.conn;
  } catch (e) {
    console.error("❌ Connection error:", e.message);
    throw e;
  }
}

export default connectDB;
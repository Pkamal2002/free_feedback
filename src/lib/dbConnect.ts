import mongoose from "mongoose";

async function dbConnect(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    console.log("✅ Database already connected");
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {});
    const state = db.connections[0].readyState;

    if (state === 1) {
      console.log("✅ Database connected successfully");
    } else {
      console.warn("⚠️ Database connection not in ready state:", state);
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

export default dbConnect;

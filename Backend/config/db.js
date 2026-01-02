
// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect('mongodb+srv://divyanshirajput310_db_user:6397692547@cluster0.wcmwvdf.mongodb.net/TaskManagement');
//     console.log("MongoDB connected successfully ✅");
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

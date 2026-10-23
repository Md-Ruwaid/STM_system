import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
    try {
        const dbUri = process.env.MONGO_URI;

        if (!dbUri) {
            console.warn("MONGO_URI is not defined. Skipping database connection.");
            return;
        }

        await mongoose.connect(dbUri);
        console.log("MongoDB connected successfully!!");
    } catch (error) {
        console.error(error.message);
    }
}

connectDB();
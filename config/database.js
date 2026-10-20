import mongoose from "mongoose";
import dotenv from "dotenv"

async function connectDB() {
    try {
        const db_uri = process.env.MONGO_URI;
        await mongoose.connect(db_uri)
    } catch (error) {
        console.log("NOt working lala")
    }
}

connectDB()
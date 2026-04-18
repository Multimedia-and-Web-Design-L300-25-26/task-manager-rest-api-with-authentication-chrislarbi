import app from "../src/app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
    if (!process.env.MONGO_URI) {
        console.error("No MONGO_URI in .env.test");
    } else {
        try {
            if (mongoose.connection.readyState === 0) {
                await mongoose.connect(process.env.MONGO_URI);
            }
        } catch (error) {
            console.error("Test DB Connection Error", error);
        }
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
});

export default app;
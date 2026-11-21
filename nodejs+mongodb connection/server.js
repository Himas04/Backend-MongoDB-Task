import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { connectNativeDB, getDB } from "./config/dbNative.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

connectNativeDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.get("/students", async (req, res) => {
//   try {
//     const db = getDB();
//     const students = await db.collection("students").find().toArray();
//     res.json(students);
//   } catch (error) {
//     console.error("❌ [Native Driver Method] Error fetching students:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/", async (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Native Driver Server running on http://localhost:${PORT} `);
});

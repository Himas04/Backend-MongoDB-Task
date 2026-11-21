import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url=process.env.MONGO_URI;
const dbName=process.env.DB_NAME || 'students_db';

const client=new MongoClient(url)

let db;

async function connectNativeDB() {
  try {
    await client.connect();
    console.log(
      `✅ [Native Driver Method] Connected to Database '${dbName}' successfully!`,
    );
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("❌ [Native Driver Method] Connection Error:", error.message);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized! Call connectNativeDB first.");
  }
  return db;
};

export  { connectNativeDB, getDB };

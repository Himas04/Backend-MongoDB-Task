# Complete Guide: Connecting Node.js with MongoDB
### (Includes both Native MongoDB Driver & Mongoose methods)

A comprehensive step-by-step tutorial for students to connect a **Node.js** server with **MongoDB** using two distinct methods:
1. **Method 1: Native MongoDB Driver (`mongodb` package / `MongoClient`)** — Manual low-level database driver.
2. **Method 2: Mongoose ODM (`mongoose` package)** — High-level schema-based modeling tool.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Method Comparison: Native Driver vs Mongoose](#2-method-comparison-native-driver-vs-mongoose)
3. [Step 1: Project Setup](#step-1-project-setup)
4. [Step 2: Environment Variables Setup (`.env`)](#step-2-environment-variables-setup-env)
5. [Method 1: Native MongoDB Driver Connection (`MongoClient`)](#method-1-native-mongodb-driver-connection-mongoclient)
   - [1.1 Install Native Driver](#11-install-native-driver)
   - [1.2 Connection Code (`config/dbNative.js`)](#12-connection-code-configdbnativejs)
   - [1.3 CRUD Operations with Native Driver (`serverNative.js`)](#13-crud-operations-with-native-driver-servernativejs)
6. [Method 2: Mongoose Connection (Schema & Model)](#method-2-mongoose-connection-schema--model)
   - [2.1 Install Mongoose](#21-install-mongoose)
   - [2.2 Connection Code (`config/dbMongoose.js`)](#22-connection-code-configdbmongoosejs)
   - [2.3 Schema Definition (`models/User.js`)](#23-schema-definition-modelsuserjs)
   - [2.4 Server Setup with Mongoose (`serverMongoose.js`)](#24-server-setup-with-mongoose-servermongoosejs)
7. [Running & Testing both Methods](#running--testing-both-methods)
8. [Troubleshooting & Common Errors](#troubleshooting--common-errors)

---

## 1. Prerequisites

- **Node.js** (v18.x or higher) — [Download Node.js](https://nodejs.org/)
- **MongoDB** (Local MongoDB Community Server or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Visual Studio Code**
- **Postman** or **Thunder Client** for testing endpoints

---

## 2. Method Comparison: Native Driver vs Mongoose

| Feature | Native MongoDB Driver (`mongodb`) | Mongoose (`mongoose`) |
|---|---|---|
| **Type** | Official Low-Level Driver | Object Data Modeling (ODM) Library |
| **Schema Validation** | None (Flexible JSON Documents) | Strict Schema Enforcement |
| **Performance** | Faster & Lightweight | Slight overhead due to abstraction |
| **Use Case** | Custom dynamic queries, microservices | Structured web applications (MERN Stack) |

---

## Step 1: Project Setup

Open your terminal and initialize a Node.js application:

```bash
# 1. Create project folder
mkdir node-mongodb-complete

# 2. Enter project folder
cd node-mongodb-complete

# 3. Initialize package.json
npm init -y
```

### Configure `package.json`
Add `"type": "module"` to use ES Module `import`/`export` syntax:

```json
{
  "name": "node-mongodb-complete",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## Step 2: Environment Variables Setup (`.env`)

Create a `.env` file in the root folder:

```env
PORT=5000

# Connection URI for Local MongoDB
MONGO_URI=mongodb://127.0.0.1:27017

# Database Name
DB_NAME=student_db

# MongoDB Atlas URI Example:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/?retryWrites=true&w=majority
```

---

## Method 1: Native MongoDB Driver Connection (`MongoClient`)

The official **Native MongoDB Driver** allows you to connect directly to database collections without enforcing schemas.

### 1.1 Install Native Driver

```bash
npm install mongodb express dotenv cors
npm install -D nodemon
```

### 1.2 Connection Code (`config/dbNative.js`)

Create `config/dbNative.js`:

```javascript
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || 'student_db';

// Create a new MongoClient instance
const client = new MongoClient(url);

let db;

export const connectNativeDB = async () => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('✅ Native MongoDB Driver Connected Successfully!');
    
    // Select database
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('❌ Native MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Helper function to get database instance
export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized! Call connectNativeDB first.');
  }
  return db;
};
```

### 1.3 CRUD Operations with Native Driver (`serverNative.js`)

Create `serverNative.js`:

```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectNativeDB, getDB } from './config/dbNative.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database connection before handling routes
connectNativeDB().then(() => {
  
  // 1. GET: Fetch all users manually from collection
  app.get('/api/users', async (req, res) => {
    try {
      const db = getDB();
      const users = await db.collection('users').find({}).toArray();
      res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // 2. POST: Insert a new user document manually
  app.post('/api/users', async (req, res) => {
    try {
      const db = getDB();
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        createdAt: new Date()
      };

      const result = await db.collection('users').insertOne(newUser);
      res.status(201).json({
        success: true,
        message: 'User inserted successfully',
        insertedId: result.insertedId
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Start Express Server
  app.listen(PORT, () => {
    console.log(`🚀 Native Driver Server running on http://localhost:${PORT}`);
  });
});
```

---

## Method 2: Mongoose Connection (Schema & Model)

Mongoose provides an elegant schema-based solution to model application data.

### 2.1 Install Mongoose

```bash
npm install mongoose express dotenv cors
```

### 2.2 Connection Code (`config/dbMongoose.js`)

Create `config/dbMongoose.js`:

```javascript
import mongoose from 'mongoose';

export const connectMongooseDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'student_db'
    });
    console.log(`✅ Mongoose Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Mongoose Connection Error: ${error.message}`);
    process.exit(1);
  }
};
```

### 2.3 Schema Definition (`models/User.js`)

Create `models/User.js`:

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    age: { type: Number, min: 1 }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
```

### 2.4 Server Setup with Mongoose (`serverMongoose.js`)

Create `serverMongoose.js`:

```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectMongooseDB } from './config/dbMongoose.js';
import User from './models/User.js';

dotenv.config();

// Connect Mongoose
connectMongooseDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. GET: Fetch all users using Mongoose Model
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. POST: Create user using Mongoose Model validation
app.post('/api/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Mongoose Server running on http://localhost:${PORT}`);
});
```

---

## Running & Testing both Methods

### Run Native Driver Method:
```bash
npx nodemon serverNative.js
```

### Run Mongoose Method:
```bash
npx nodemon serverMongoose.js
```

---

## Troubleshooting & Common Errors

| Error | Cause | Solution |
|---|---|---|
| `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017` | Local MongoDB service is stopped. | Start MongoDB service or verify MongoDB installation. |
| `Cannot read properties of undefined (reading 'collection')` | Trying to query before `client.connect()` finishes. | Always await `client.connect()` before returning database instance. |
| `ValidationError: User validation failed` | Data does not match Mongoose schema rules. | Pass required fields (`name`, `email`) matching Schema types. |

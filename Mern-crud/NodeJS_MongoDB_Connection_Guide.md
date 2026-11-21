# Complete Guide: Connecting Node.js with MongoDB

A comprehensive step-by-step tutorial for students to set up a **Node.js** server and connect it to a **MongoDB** database using **Express** and **Mongoose**.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Project Architecture](#2-project-architecture)
3. [Step 1: Initialize Node.js Project](#step-1-initialize-nodejs-project)
4. [Step 2: Install Dependencies](#step-2-install-dependencies)
5. [Step 3: Configure `package.json`](#step-3-configure-packagejson)
6. [Step 4: Environment Variables Setup (`.env`)](#step-4-environment-variables-setup-env)
7. [Step 5: Database Connection Setup (`db.js`)](#step-5-database-connection-setup-dbjs)
8. [Step 6: Create the Express Server (`server.js`)](#step-6-create-the-express-server-serverjs)
9. [Step 7: Define a Mongoose Schema & Model](#step-7-define-a-mongoose-schema--model)
10. [Step 8: Run and Test the Application](#step-8-run-and-test-the-application)
11. [Troubleshooting & Common Errors](#troubleshooting--common-errors)

---

## 1. Prerequisites

Before starting, ensure you have the following installed on your system:
- **Node.js** (v18.x or higher) — [Download Node.js](https://nodejs.org/)
- **MongoDB** (Installed locally OR a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Visual Studio Code** or any code editor
- **Postman** or **Thunder Client** (VS Code extension) for API testing

---

## 2. Project Architecture

Here is the recommended folder structure for a standard Node.js + MongoDB backend:

```text
node-mongodb-app/
├── node_modules/
├── config/
│   └── db.js            # MongoDB Connection Logic
├── models/
│   └── User.js          # Mongoose Schema & Model
├── .env                 # Secret environment variables
├── .gitignore           # Git ignore file
├── package.json         # Project metadata and dependencies
└── server.js            # Entry point of the Express app
```

---

## Step 1: Initialize Node.js Project

Open your Terminal / Command Prompt and execute the following commands step-by-step:

```bash
# 1. Create a new directory for your project
mkdir node-mongodb-app

# 2. Navigate into the project folder
cd node-mongodb-app

# 3. Initialize a new Node.js project (creates package.json)
npm init -y
```

---

## Step 2: Install Dependencies

Install the core dependencies required for backend development and database interaction:

```bash
# Install main packages
npm install express mongoose dotenv cors

# Install development tool (Auto-restarts server on code edits)
npm install -D nodemon
```

### Package Explanations:
- `express`: Lightweight web framework for handling HTTP requests.
- `mongoose`: Object Data Modeling (ODM) library for MongoDB and Node.js.
- `dotenv`: Loads environment variables from a `.env` file into `process.env`.
- `cors`: Enables Cross-Origin Resource Sharing between Frontend and Backend.
- `nodemon`: Automatically restarts the Node application when file changes are detected.

---

## Step 3: Configure `package.json`

Open `package.json` and add `"type": "module"` (if using ES module `import`/`export` syntax) and configure the start scripts:

```json
{
  "name": "node-mongodb-app",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mongoose": "^8.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

---

## Step 4: Environment Variables Setup (`.env`)

Create a file named `.env` in the root folder of your project.

```env
PORT=5000

# For Local MongoDB Instance:
MONGO_URI=mongodb://127.0.0.1:27017/student_db

# For Cloud MongoDB Atlas (replace credentials):
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/student_db?retryWrites=true&w=majority
```

> **Security Tip:** Never commit your `.env` file to public GitHub repositories! Add `.env` inside `.gitignore`.

---

## Step 5: Database Connection Setup (`db.js`)

Create a `config` folder and inside it, create `db.js`.

**File Path:** `config/db.js`

```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Failure: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
```

---

## Step 6: Create the Express Server (`server.js`)

Create `server.js` in the root directory. This is the main entry point of your application.

**File Path:** `server.js`

```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Node.js & MongoDB API'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## Step 7: Define a Mongoose Schema & Model

Create a `models` folder and inside it, create `User.js`.

**File Path:** `models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true
    },
    age: {
      type: Number,
      min: 1
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

const User = mongoose.model('User', userSchema);

export default User;
```

---

## Step 8: Run and Test the Application

### 1. Start the Server
Run the development server command in your terminal:

```bash
npm run dev
```

### 2. Verify Output in Terminal
You should see output similar to this:

```text
[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] starting `node server.js`
🚀 Server running on http://localhost:5000
✅ MongoDB Connected Successfully: 127.0.0.1
```

### 3. Test in Browser
Open your browser and navigate to `http://localhost:5000`.  
You should see:
```json
{
  "success": true,
  "message": "Welcome to Node.js & MongoDB API"
}
```

---

## Troubleshooting & Common Errors

| Error | Cause | Solution |
|---|---|---|
| `econnsrefused 127.0.0.1:27017` | Local MongoDB service is not running. | Start MongoDB service (`net start MongoDB` or via MongoDB Compass). Or use `127.0.0.1` instead of `localhost`. |
| `MongooseServerSelectionError` | Invalid Cloud Atlas credentials or IP not whitelisted. | Check IP Whitelist in MongoDB Atlas under Network Access (Allow `0.0.0.0/0`). |
| `Cannot use import statement outside a module` | `type: "module"` missing in `package.json`. | Add `"type": "module"` to `package.json` or use `const express = require('express')`. |
| `process.env.MONGO_URI is undefined` | `dotenv.config()` not called before database connection. | Call `dotenv.config()` at the very top of `server.js`. |

---

## 🎯 Summary Checklist for Students

1. [x] `npm init -y`
2. [x] `npm install express mongoose dotenv cors`
3. [x] Add `"type": "module"` in `package.json`
4. [x] Define `MONGO_URI` in `.env`
5. [x] Call `mongoose.connect()` in `db.js`
6. [x] Start server with `npm run dev`

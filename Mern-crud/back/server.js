const express = require('express');
const cors = require('cors');
const connectMongoose = require('./config/dbMongoose');
const { connectNativeDB } = require('./config/dbNative');

const studentRoutes = require('./routes/studentRoutes');
const nativeStudentRoutes = require('./routes/nativeStudentRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Mongoose Routes
app.use('/api/students', studentRoutes);

// 2. Native MongoDB Driver Routes
app.use('/api/native-students', nativeStudentRoutes);

// Connect both Database methods and start server
async function startServer() {
    await connectMongoose();  // Method 1: Mongoose Connection
    await connectNativeDB();   // Method 2: Native Driver Connection

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

startServer();


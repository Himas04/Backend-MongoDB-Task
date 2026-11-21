const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'mern_crud';

const client = new MongoClient(url);
let db;

const connectNativeDB = async () => {
    try {
        await client.connect();
        console.log(`✅ [Native Driver Method] Connected to Database '${dbName}' successfully!`);
        db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('❌ [Native Driver Method] Connection Error:', error.message);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized! Call connectNativeDB first.');
    }
    return db;
};

module.exports = { connectNativeDB, getDB };

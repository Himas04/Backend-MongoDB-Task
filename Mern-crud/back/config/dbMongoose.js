const mongoose = require('mongoose');

const connectMongoose = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_crud');
        console.log(`✅ [Mongoose Method] Connected to Database successfully!`);
    } catch (error) {
        console.error('❌ [Mongoose Method] Connection Error:', error.message);
    }
};

module.exports = connectMongoose;

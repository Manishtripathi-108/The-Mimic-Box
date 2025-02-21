import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
    throw new Error('❌ MONGODB_URI is not defined in the environment variables');
}

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: process.env.MONGODB_DB || 'default_db',
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
    }
}

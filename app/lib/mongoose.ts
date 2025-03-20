import mongoose from 'mongoose';

export default async function connectToDatabase() {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.DB_CONNECTION as string, {
          dbName: 'financeAiDb', // Replace with your database name
        });
        console.log('Connected to MongoDB with Mongoose');
      }
    } catch (error) {
      console.error('Mongoose connection error:', error);
      throw error;
    }
  }
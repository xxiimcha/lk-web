import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable.');
}

// Single shared connection
let isConnected: boolean = false;

async function dbConnect() {
  if (isConnected) {
    console.log('Using existing MongoDB connection.');
    return mongoose.connection;
  }

  console.log('Establishing new MongoDB connection...');
  const db = await mongoose.connect(MONGODB_URI);
  isConnected = true;
  console.log('Connected to MongoDB.');

  return db.connection;
}

export default dbConnect;

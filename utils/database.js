const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

// Database connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bhagwat_gita', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Database disconnection function
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Gracefully shutting down...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Gracefully shutting down...');
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };

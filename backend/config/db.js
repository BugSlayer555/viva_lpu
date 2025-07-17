const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB se connect karna, URL aur options pass kar rahe hain
    await mongoose.connect(process.env.MONGODB_URL, {
         // naya topology engine use karo
    });
    console.log('MONGODB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // agar connection fail ho gaya toh app ko band kar do
  }
}

module.exports = connectDB;  // function export kar rahe hain

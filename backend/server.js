const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. App Initialize
const app = express();
dotenv.config();   // typo tha: 'coonfig' nahi, 'config' hona chahiye

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Routes import (syntax galat tha)
const authRoutes = require('./routes/auth');   // sirf path dena hai, comma nahi
const taskRoutes = require('./routes/tasks');  // filename 'tasks' hona chahiye agar folder me waisa hi hai

// 4. Routes use karo
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 5. Database connect karo
connectDB();

// 6. Server start karo
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);  // template literal me backticks use karne hain ``, quotes nahi
});

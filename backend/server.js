const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['https://password-manager-sage-six.vercel.app', 'https://securevault-frontend-1.onrender.com', 'http://localhost:5173'], // Add your Vercel URL here
    credentials: true
}));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/passwords', require('./routes/passwords'));
app.use('/api/v1/documents', require('./routes/documents'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

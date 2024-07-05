import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // To load environment variables. we will hide .env file
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser'; // To handle cookies
import path from 'path'; // Path for file and directory paths
import cors from 'cors'; // To handle Cross-Origin Resource Sharing

dotenv.config(); // Load environment variables from .env file

mongoose
  .connect(process.env.MONGO) // Connecting to MongoDB using the connection string from environment variables
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve(); // Get the current directory name

const app = express(); 
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies in incoming requests

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist'))); // Serve static files from the client/dist directory

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html')); // Serve the index.html file for any other routes
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

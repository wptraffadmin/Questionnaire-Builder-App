import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import questionnaireRoutes from './routes/questionnaireRoutes';
import answerRoutes from './routes/answerRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://questionnaire-builder-app-1jj8.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/answers', answerRoutes);

// Simple route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/questionnaire-builder';

console.log('Attempting to connect to MongoDB...');
console.log(`MongoDB URI provided: ${MONGODB_URI ? 'Yes (hidden for security)' : 'No'}`);
console.log('Environment variables available:', Object.keys(process.env).join(', '));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    
    // Start server anyway so we can see logs
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (but without database connection)`);
    });
  }); 
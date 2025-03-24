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
    'https://your-frontend-domain.vercel.app',
    'https://your-frontend-domain.vercel.app/'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/answers', answerRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/questionnaire-builder';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 
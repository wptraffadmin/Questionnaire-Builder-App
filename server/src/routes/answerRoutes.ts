import express from 'express';
import {
  submitAnswers,
  getAnswers,
  getAllAnswers,
  getQuestionnaireStats
} from '../controllers/answerController';

const router = express.Router();

// Порядок важливий! Більш конкретні маршрути повинні бути першими
router.get('/stats/:questionnaireId', getQuestionnaireStats);
router.get('/', getAllAnswers);
router.get('/:questionnaireId', getAnswers);
router.post('/:questionnaireId', submitAnswers);

export default router; 
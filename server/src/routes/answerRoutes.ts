import express from 'express';
import {
  submitAnswers,
  getAnswers,
  getAllAnswers,
  getQuestionnaireStats
} from '../controllers/answerController';

const router = express.Router();

router.post('/:questionnaireId', submitAnswers);
router.get('/:questionnaireId', getAnswers);
router.get('/', getAllAnswers);
router.get('/stats/:questionnaireId', getQuestionnaireStats);

export default router; 
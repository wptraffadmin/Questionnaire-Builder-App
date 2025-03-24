import express from 'express';
import {
  getAllQuestionnaires,
  getQuestionnaireById,
  createQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire
} from '../controllers/questionnaireController';

const router = express.Router();

router.get('/', getAllQuestionnaires);
router.get('/:id', getQuestionnaireById);
router.post('/', createQuestionnaire);
router.put('/:id', updateQuestionnaire);
router.delete('/:id', deleteQuestionnaire);

export default router; 
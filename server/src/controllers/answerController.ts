import { Request, Response } from 'express';
import { Answer } from '../models/Answer';
import Questionnaire from '../models/Questionnaire';

export const submitAnswers = async (req: Request, res: Response) => {
  try {
    const { questionnaireId } = req.params;
    const { answers } = req.body;

    const answer = new Answer({
      questionnaireId,
      answers
    });

    await answer.save();
    res.status(201).json({ message: 'Відповіді успішно збережено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при збереженні відповідей', error });
  }
};

export const getAnswers = async (req: Request, res: Response) => {
  try {
    const { questionnaireId } = req.params;
    const answers = await Answer.find({ questionnaireId });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні відповідей', error });
  }
};

export const getAllAnswers = async (req: Request, res: Response) => {
  try {
    const answers = await Answer.find().populate('questionnaireId');
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні всіх відповідей', error });
  }
};

export const getQuestionnaireStats = async (req: Request, res: Response) => {
  try {
    const { questionnaireId } = req.params;
    
    // Отримуємо кількість відповідей
    const totalResponses = await Answer.countDocuments({ questionnaireId });
    
    // Отримуємо кількість запитань
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Опитування не знайдено' });
    }
    
    const questionsCount = questionnaire.questions.length;

    res.json({
      totalResponses,
      questionsCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні статистики', error });
  }
}; 
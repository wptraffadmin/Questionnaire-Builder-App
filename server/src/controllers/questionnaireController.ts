import { Request, Response } from 'express';
import Questionnaire, { IQuestionnaire } from '../models/Questionnaire';

export const getAllQuestionnaires = async (req: Request, res: Response) => {
  try {
    const questionnaires = await Questionnaire.find();
    res.json(questionnaires);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questionnaires', error });
  }
};

export const getQuestionnaireById = async (req: Request, res: Response) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }
    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questionnaire', error });
  }
};

export const createQuestionnaire = async (req: Request, res: Response) => {
  try {
    const questionnaire = new Questionnaire(req.body);
    const savedQuestionnaire = await questionnaire.save();
    res.status(201).json(savedQuestionnaire);
  } catch (error) {
    res.status(400).json({ message: 'Error creating questionnaire', error });
  }
};

export const updateQuestionnaire = async (req: Request, res: Response) => {
  try {
    const questionnaire = await Questionnaire.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }
    res.json(questionnaire);
  } catch (error) {
    res.status(400).json({ message: 'Error updating questionnaire', error });
  }
};

export const deleteQuestionnaire = async (req: Request, res: Response) => {
  try {
    const questionnaire = await Questionnaire.findByIdAndDelete(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }
    res.json({ message: 'Questionnaire deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting questionnaire', error });
  }
}; 
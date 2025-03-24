import axios from 'axios';
import { Questionnaire } from '../types';

const API_URL = 'http://localhost:5000/api';

export const editQuestionnaireService = {
  getQuestionnaireById: (id: string) => 
    axios.get<Questionnaire>(`${API_URL}/questionnaires/${id}`).then(res => res.data),
  
  updateQuestionnaire: (id: string, data: Partial<Questionnaire>) => 
    axios.put<Questionnaire>(`${API_URL}/questionnaires/${id}`, data).then(res => res.data),
  
  deleteQuestionnaire: (id: string) => 
    axios.delete(`${API_URL}/questionnaires/${id}`).then(res => res.data),
}; 
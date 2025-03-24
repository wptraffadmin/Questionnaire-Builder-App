export interface Question {
  _id: string;
  text: string;
  type: 'text' | 'radio' | 'checkbox' | 'select';
  required: boolean;
  options?: string[];
}

export interface Questionnaire {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
} 
export interface BaseQuestion {
  text: string;
  type: 'text' | 'radio' | 'checkbox' | 'select';
  required: boolean;
  options?: string[];
}

export interface Question extends BaseQuestion {
  _id: string;
}

export interface BaseQuestionnaire {
  title: string;
  description?: string;
  questions: BaseQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface Questionnaire extends BaseQuestionnaire {
  _id: string;
} 
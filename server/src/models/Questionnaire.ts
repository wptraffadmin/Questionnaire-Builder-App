import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  text: string;
  type: 'text' | 'radio' | 'checkbox' | 'select';
  options?: string[];
  required: boolean;
}

export interface IQuestionnaire extends Document {
  title: string;
  description?: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['text', 'radio', 'checkbox', 'select']
  },
  options: [{ type: String }],
  required: { type: Boolean, default: false }
});

const QuestionnaireSchema = new Schema<IQuestionnaire>({
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuestionSchema]
}, {
  timestamps: true
});

export default mongoose.model<IQuestionnaire>('Questionnaire', QuestionnaireSchema); 
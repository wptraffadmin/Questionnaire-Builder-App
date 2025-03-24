import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionnaireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questionnaire',
    required: true
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Answer = mongoose.model('Answer', answerSchema); 
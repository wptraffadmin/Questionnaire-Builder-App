import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { createQuestionnaire } from '../../store/slices/questionnaireSlice';
import { BaseQuestion, BaseQuestionnaire } from '../../types';
import styles from './CreateQuestionnaireForm.module.css';

const CreateQuestionnaireForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.questionnaires);
  const [showSuccess, setShowSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<BaseQuestion[]>([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'text',
        required: false,
        options: [],
      },
    ]);
  };

  const handleQuestionChange = (index: number, field: keyof BaseQuestion, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options = [
      ...updatedQuestions[questionIndex].options,
      '',
    ];
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const now = new Date().toISOString();
      const questionnaireData: BaseQuestionnaire = {
        title,
        description,
        questions,
        createdAt: now,
        updatedAt: now
      };
      await dispatch(createQuestionnaire(questionnaireData)).unwrap();
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating questionnaire:', error);
    }
  };

  const handleCreateNew = () => {
    setTitle('');
    setDescription('');
    setQuestions([]);
    setShowSuccess(false);
  };

  if (showSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successMessage}>
          <h2 className={styles.successTitle}>Survey successfully created!</h2>
          <div className={styles.successActions}>
            <button onClick={handleCreateNew} className={styles.actionButton}>
              Create another questionnaire
            </button>
            <button onClick={() => navigate('/')} className={styles.actionButton}>
              Go to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>Creating a new survey</h1>
      <form onSubmit={handleSubmit} className={styles.createQuestionnaireForm}>
      <div className={styles.formGroup}>
        <input
          className={styles.input}
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Survey title"
        />
      </div>

      <div className={styles.formGroup}>
        <textarea
          className={styles.input}
          id="description"
          placeholder="Survey description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.questionsSection}>
        <h3>Question</h3>
        {questions.map((question, qIndex) => (
          <div key={qIndex} className={styles.questionItem}>
            <div className={styles.formGroup}>
              <input
                placeholder="Question text"
                className={styles.input}
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <select
                className={styles.input}
                value={question.type}
                onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
              >
                <option value="text">Text response</option>
                <option value="radio">Single Choice</option>
                <option value="checkbox">Multiple Choice</option>
                <option value="select">Dropdown List</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => handleQuestionChange(qIndex, 'required', e.target.checked)}
                />
                Required question
              </label>
            </div>

            {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'select') && (
              <div className={styles.optionsSection}>
                <h4>Answer options</h4>
                {(question.options || []).map((option, oIndex) => (
                  <div key={oIndex} className={styles.optionItem}>
                    <input
                      className={styles.input}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      placeholder={`Variant ${oIndex + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(qIndex, oIndex)}
                      className={styles.button}
                    >
                      Delete option
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption(qIndex)}
                  className={styles.button}
                >
                  Add option
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleRemoveQuestion(qIndex)}
              className={styles.button}
            >
              Delete question
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className={styles.button}
        >
          Add question
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <button
        type="submit"
        className={styles.button}
        disabled={loading}
      >
        {loading ? 'Creation...' : 'Create a survey'}
      </button>
    </form>
    </div>
  );
};

export default CreateQuestionnaireForm; 
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchQuestionnaires } from '../../store/slices/questionnaireSlice';
import QuestionnaireCard from '../../components/QuestionnaireCard/QuestionnaireCard';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { questionnaires, loading, error } = useSelector(
    (state: RootState) => state.questionnaires
  );

  useEffect(() => {
    dispatch(fetchQuestionnaires());
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page">
      <h1>Опитування</h1>
      <div className="questionnaires-list">
        {questionnaires.map((questionnaire) => (
          <QuestionnaireCard
            key={questionnaire._id}
            questionnaire={questionnaire}
          />
        ))}
      </div>
      <Link to="/create" className="create-button">
        Створити нове опитування
      </Link>
    </div>
  );
};

export default HomePage;
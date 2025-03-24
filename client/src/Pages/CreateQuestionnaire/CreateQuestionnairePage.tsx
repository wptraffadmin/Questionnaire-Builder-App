import CreateQuestionnaireForm from '../../components/CreateQuestionnaireForm/CreateQuestionnaireForm';
import './CreateQuestionnaire.css';

const CreateQuestionnairePage = () => {
  return (
    <div className="create-questionnaire-page">
      <h1>Створення нового опитування</h1>
      <CreateQuestionnaireForm />
    </div>
  );
};

export default CreateQuestionnairePage; 
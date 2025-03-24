import React from 'react';
import EditQuestionnaireForm from '../../components/EditQuestionnaireForm/EditQuestionnaireForm';

const EditQuestionnairePage: React.FC = () => {
  return (
    <div className="edit-questionnaire-page">
      <h1>Редагування опитування</h1>
      <EditQuestionnaireForm />
    </div>
  );
};

export default EditQuestionnairePage; 
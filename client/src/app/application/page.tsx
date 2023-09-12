'use client';

import ApplicationForm from '../components/ApplicationForm';

const Application = () => {
  const props = {
    user_id: 1,
    company_id: 1,
    company_name: 'Test This',
  };

  return <ApplicationForm {...props} />;
};

export default Application;

'use client';

import ApplicationForm from '../components/ApplicationForm';
import CompanyForm from '../components/CompanyForm';

const Application = () => {
  const appProps = {
    user_id: 1,
    company_id: 1,
    company_name: 'Test This',
  };

  const compProps = {
    user_id: 1,
  };

  return (
    <>
      <CompanyForm {...compProps} />
      <ApplicationForm {...appProps} />
    </>
  );
};

export default Application;
